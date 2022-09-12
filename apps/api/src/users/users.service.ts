import {
  HttpException,
  HttpStatus,
  Injectable,
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private contactsService: ContactsService,
    private organisationsService: OrganisationsService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);
    if (user != null) {
      throw new UsernameAlreadyExistsException(
        'Username: ' + createUserDto.username + ' already exists!'
      );
    }

    try {
      const newUser = new User();
      newUser.firstName = createUserDto.firstName;
      newUser.lastName = createUserDto.lastName;
      newUser.username = createUserDto.username;
      newUser.role = createUserDto.role;
      newUser.contact = createUserDto.contact;

      const salt = await bcrypt.genSalt();
      newUser.salt = salt;
      newUser.password = await bcrypt.hash(createUserDto.password, salt);

      const organisation = await this.organisationsService.findOne(
        createUserDto.organisationId
      );
      if (organisation) {
        newUser.organisation = organisation;
      } else {
        throw new NotFoundException(`organisation with id : ${createUserDto.organisationId} cannot be found!`)
      }

      return this.usersRepository.save(newUser);
    } catch (err) {
      console.log(err);
      throw err;
    }
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
        relations: {contact: true, organisation: true}
      });
    } catch (err) {
      throw new NotFoundException('No user with id: ' + id + ' found!');
    }
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: username });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.password = updateUserDto.password;
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
}
