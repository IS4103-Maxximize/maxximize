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
      createUserDto.organisationId == null ||
      createUserDto.contact == null
    ) { 
      throw new HttpException(
        'Invalid payload: null value detected',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.usersService.create(createUserDto);
  }

  @Get('findAllUsers')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('findUser/:id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Patch('updateUser/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('deleteUser/:id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
