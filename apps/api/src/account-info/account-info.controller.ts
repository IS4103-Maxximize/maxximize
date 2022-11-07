import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountInfoService } from './account-info.service';
import { CreateAccountInfoDto } from './dto/create-account-info.dto';
import { UpdateAccountInfoDto } from './dto/update-account-info.dto';

@Controller('account-info')
export class AccountInfoController {
  constructor(private readonly accountInfoService: AccountInfoService) {}

  @Post()
  create(@Body() createAccountInfoDto: CreateAccountInfoDto) {
    return this.accountInfoService.create(createAccountInfoDto);
  }

  @Get()
  findAll() {
    return this.accountInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountInfoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountInfoDto: UpdateAccountInfoDto
  ) {
    return this.accountInfoService.update(+id, updateAccountInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountInfoService.remove(+id);
  }
}
