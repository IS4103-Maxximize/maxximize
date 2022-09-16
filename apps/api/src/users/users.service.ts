import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactsService } from '../contacts/contacts.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsernameAlreadyExistsException } from './exceptions/UsernameAlreadyExistsException';
import * as bcrypt from 'bcrypt';
import { UpdateContactDto } from '../contacts/dto/update-contact.dto';
import { MailService } from '../mail/mail.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private contactsService: ContactsService,
    private organisationsService: OrganisationsService,
    private mailService: MailService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);
    if (user != null) {
      throw new UsernameAlreadyExistsException(
        'Username: ' + createUserDto.username + ' already exists!'
      );
    }

    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.username = createUserDto.username;
    newUser.role = createUserDto.role;

    const contact = new Contact();
    contact.address = createUserDto.contact.address;
    contact.email = createUserDto.contact.email;
    contact.phoneNumber = createUserDto.contact.phoneNumber;
    contact.postalCode = createUserDto.contact.postalCode;
    newUser.contact = contact;

    const salt = await bcrypt.genSalt();
    newUser.salt = salt;
    const password = Math.random().toString(36).slice(-8);
    console.log(password);
    newUser.password = await bcrypt.hash(password, salt);

    const organisation = await this.organisationsService.findOne(
      createUserDto.organisationId
    );
    if (organisation) {
      newUser.organisation = organisation;
    } else {
      throw new NotFoundException(
        `Organisation with id : ${createUserDto.organisationId} cannot be found!`
      );
    }

    //check contact email whether its unique in user's organisation

    const allEmailsInOrganisation = await this.getAllEmailsInOrganisation(
      organisation
    );
    if (allEmailsInOrganisation.includes(createUserDto.contact.email)) {
      throw new NotFoundException(
        'Email is already being used by another user or the organisation you are in!'
      );
    }

    const savedUser = await this.usersRepository.save(newUser);

    try {
      await this.mailService.sendPasswordEmail(
        createUserDto.contact.email,
        organisation.name,
        newUser,
        password,
        organisation.id
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'Unable to send email successfully'
      );
    }

    return savedUser;
  }

  findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find({
        relations: { contact: true },
      });
    } catch (err) {
      throw new NotFoundException('No users found!');
    }
  }

  findOne(id: number): Promise<User> {
    try {
      return this.usersRepository.findOne({
        where: { id },
        relations: { contact: true, organisation: true },
      });
    } catch (err) {
      throw new NotFoundException('No user with id: ' + id + ' found!');
    }
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: username });
  }

  async getAllEmailsInOrganisation(organisation: Organisation) {
    const users = organisation.users;
    const usersWithContactPromises = users.map(async (user) => {
      return await this.findOne(user.id);
    });
    const usersWithContact = await Promise.all(usersWithContactPromises);
    const usersEmail = usersWithContact.map((user) => user.contact.email);
    return [...usersEmail, organisation.contact.email];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.isActive = updateUserDto.isActive;
    user.role = updateUserDto.role;

    const updateContactDto = new UpdateContactDto();
    updateContactDto.address = updateUserDto.contact.address;
    updateContactDto.email = updateUserDto.contact.email;
    updateContactDto.phoneNumber = updateUserDto.contact.phoneNumber;
    updateContactDto.postalCode = updateUserDto.contact.postalCode;
    this.contactsService.update(user.contact.id, updateContactDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.contactsService.remove(user.contact.id);
      await this.usersRepository.delete(id);
    } catch (err) {
      throw new HttpException(
        'Error deleting user: ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    user.password = await bcrypt.hash(updateUserDto.password, user.salt);
    if (!user.passwordChanged) {
      user.passwordChanged = true;
    }
    return this.usersRepository.save(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const email = forgotPasswordDto.email;
    const organisationId = forgotPasswordDto.organisationId;
    const organisation = await this.organisationsService.findOne(
      organisationId
    );
    if (organisation) {
      let user: User;
      organisation.users.forEach((organisationUser) => {
        if (organisationUser.contact.email == email) {
          user = organisationUser;
        }
      });

      if (user) {
        const password = Math.random().toString(36).slice(-8);
        console.log(password);
        user.password = await bcrypt.hash(password, user.salt);
        user.passwordChanged = false;
        this.usersRepository.save(user);
        try {
          const name = user.firstName + " " + user.lastName;
          await this.mailService.sendForgotPasswordEmail(email, password, name, organisationId, organisation.name);
        } catch (err) {
          throw new InternalServerErrorException(
            'Unable to send email successfully'
          );
        }
      } else {
        throw new BadRequestException(
          `User with email: ${email} cannot be found in organisation with id ${organisationId}`
        );
      }
    } else {
      throw new BadRequestException(
        `Organisation: ${organisationId} cannot be found`
      );
    }
  }
}
