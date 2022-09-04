import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactsService } from '../contacts/contacts.service';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UnknownPersistenceException } from './exceptions/UnknownPersistenceException';
import { UsernameAlreadyExistsException } from './exceptions/UsernameAlreadyExistsException';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private contactsService: ContactsService,
    private organisationsService: OrganisationsService
  ) {}

  // ----- TESTING -----
  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);
    if (user != null) {
      throw new UsernameAlreadyExistsException("Username: " + createUserDto.username + " already exists!");
    }

    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;
    newUser.role = createUserDto.role;
    newUser.organisation = createUserDto.organisation;
    newUser.contact = createUserDto.contact;
    
    try {
      const contactDto = new CreateContactDto();
      contactDto.address = createUserDto.contact.address;
      contactDto.email = createUserDto.contact.email;
      contactDto.phoneNumber = createUserDto.contact.phoneNumber;
      contactDto.user = newUser;
      this.contactsService.create(contactDto);

      const organisation = await this.organisationsService.findOne(
        createUserDto.organisation.id
      );
      organisation.users.push(newUser);
      this.organisationsService.directUpdate(organisation);

      return this.usersRepository.save(newUser);
    } catch (err) {
      throw new UnknownPersistenceException(err);
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
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

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
