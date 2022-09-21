import { Module } from '@nestjs/common';
import { QaRulesService } from './qa-rules.service';
import { QaRulesController } from './qa-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaRule } from './entities/qa-rule.entity';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([QaRule]), OrganisationsModule],
  controllers: [QaRulesController],
  providers: [QaRulesService],
  exports: [QaRulesService]
})
export class QaRulesModule {}
