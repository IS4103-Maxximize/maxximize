import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { BusinessType } from './enums/businessType.enum';
import * as fs from 'fs';
import { promisify } from 'util';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Application } from '../applications/entities/application.entity';
import { ApplicationsService } from '../applications/applications.service';
import { extname } from 'path';

@Injectable()
export class FilesService {
  constructor(private organisationService: OrganisationsService,
  @InjectRepository(File)
  private readonly fileRepository: Repository<File>,
  private applicationService: ApplicationsService){}
  async create(createFileDto: CreateFileDto) {
    const { name, type, organisationId} = createFileDto
    const organisation = await this.organisationService.findOne(organisationId)
    const newFile = this.fileRepository.create({
      name: name,
      businessType: type,
      organisationId: organisation.id
    })
    return this.fileRepository.save(newFile)
  }

  async uploadAndCreateFiles(files: Express.Multer.File[], type: string, orgId: number, applicationId: number) {
    let organisationToBeAdded: Organisation
    let applicationToBeAdded: Application
    organisationToBeAdded = orgId ? await this.organisationService.findOne(orgId) : null
    applicationToBeAdded = applicationId ? await this.applicationService.findOne(applicationId) : null
    const businessType = type === 'validation' ? BusinessType.VALIDATION : BusinessType.FINANCE
    const newFiles = []
    for (const file of files) {
      const { filename } = file
      const newFile = this.fileRepository.create({
        name: filename,
        businessType: businessType,
        organisationId: organisationToBeAdded ? organisationToBeAdded.id : null,
        applicationId: applicationToBeAdded ? applicationToBeAdded.id : null
      })
      newFiles.push(await this.fileRepository.save(newFile))
    }
    return newFiles
  }

  findAll() {
    return this.fileRepository.find({relations: {
      organisation: true
    }})
  }

  async findOne(id: number) {
    try {
      return await this.fileRepository.findOneOrFail({
        where: {
          id
        }, relations: {
          organisation: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`file with id: ${id} cannot be found `)
    }
  }

  async findAllByOrg(id: number) {
    return this.fileRepository.find({
      where: {
        organisationId: id
      },
      relations: {
        organisation: true
      }
    })
  }

  async download(id: number) {
    const entityFile = await this.findOne(id)
    const path = `uploads/${entityFile.name}`
    return {
      path,
      fileType: extname(entityFile.name),
      fileName: entityFile.name
    }
    
  }

  async findAllByApplication(id: number) {
    return this.fileRepository.find({
      where: {
        applicationId: id
      },
      relations: {
        application: true
      }
    })
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(id: number) {
    const fileToDelete = await this.findOne(id)
    const unlinkAsync = promisify(fs.unlink)
    const path = `uploads/${fileToDelete.name}`
    await unlinkAsync(path)
    return await this.fileRepository.remove(fileToDelete)
  }
}
