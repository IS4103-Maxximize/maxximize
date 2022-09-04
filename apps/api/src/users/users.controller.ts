import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsernameAlreadyExistsException } from './exceptions/UsernameAlreadyExistsException';
import { UnknownPersistenceException } from './exceptions/UnknownPersistenceException';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (
      createUserDto.firstName == null ||
      createUserDto.lastName == null ||
      createUserDto.password == null ||
      createUserDto.role == null ||
      createUserDto.username == null ||
      createUserDto.organisation == null ||
      createUserDto.contact == null
    ) { 
      throw new HttpException(
        'Invalid payload: null value detected',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      return this.usersService.create(createUserDto);
    } catch (err) {
      if (err instanceof UsernameAlreadyExistsException) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else if (err instanceof UnknownPersistenceException) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    } 
  }

  @Get('findAllUsers')
  async findAll() {
    return this.usersService.findAll().catch(() => {
      throw new HttpException('No users found', HttpStatus.BAD_REQUEST);
    });
  }

  @Get('findUser:id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(+id).catch(() => {
      throw new HttpException('No users found', HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('updateUser:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto).catch(() => {
      throw new HttpException('No users found', HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('deleteUser:id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id).catch(() => {
      throw new HttpException('No user with id: ' + id + ' found', HttpStatus.BAD_REQUEST);
    });
  }
}
