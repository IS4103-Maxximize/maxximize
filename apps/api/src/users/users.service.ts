import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactsService } from '../contacts/contacts.service';
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
    
    try {
      const newUser = new User();
      newUser.firstName = createUserDto.firstName;
      newUser.lastName = createUserDto.lastName;
      newUser.username = createUserDto.username;
      newUser.password = createUserDto.password;
      newUser.role = createUserDto.role;
      newUser.contact = createUserDto.contact;
      
      const organisation = await this.organisationsService.findOne(createUserDto.organisationId);
      newUser.organisation = organisation;

      return this.usersRepository.save(newUser);
    } catch (err) {
      throw new UnknownPersistenceException(err);
    }
  }

  findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (err) {
      throw new NotFoundException("No users found!");
    }
  }

  findOne(id: number): Promise<User> {
    try {
      return this.usersRepository.findOneBy({ id });
    } catch (err) {
      throw new NotFoundException("No user with id: " + id + " found!");
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

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.usersRepository.delete(id);
      return true;
    } catch (err) {
      throw new HttpException("Error deleting user: " + id, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
