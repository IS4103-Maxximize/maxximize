import { Module } from '@nestjs/common';
import { QaChecklistsService } from './qa-checklists.service';
import { QaChecklistsController } from './qa-checklists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaChecklist } from './entities/qa-checklist.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { QaRulesModule } from '../qa-rules/qa-rules.module';

@Module({
  imports: [TypeOrmModule.forFeature([QaChecklist]), OrganisationsModule, QaRulesModule],
  controllers: [QaChecklistsController],
  providers: [QaChecklistsService],
  exports: [QaChecklistsService]
})
export class QaChecklistsModule {}
