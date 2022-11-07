import { Module } from '@nestjs/common';
import { AccountInfoService } from './account-info.service';
import { AccountInfoController } from './account-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInfo } from './entities/account-info.entity';
import { Organisation } from '../organisations/entities/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountInfo, Organisation])],
  controllers: [AccountInfoController],
  providers: [AccountInfoService],
  exports: [AccountInfoService]
})
export class AccountInfoModule {}
