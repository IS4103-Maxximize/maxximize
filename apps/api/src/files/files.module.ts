import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), OrganisationsModule, ApplicationsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
