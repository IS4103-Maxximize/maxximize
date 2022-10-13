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

@Injectable()
export class FilesService {
  constructor(private organisationService: OrganisationsService,
  @InjectRepository(File)
  private readonly fileRepository: Repository<File>){}
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

  async createFilesWithType(files: Express.Multer.File[], orgId: number, type: string) {
    const organisation = await this.organisationService.findOne(orgId)
    const businessType = type === 'validation' ? BusinessType.VALIDATION : BusinessType.FINANCE
    const newFiles = []
    for (const file of files) {
      const { filename } = file
      const newFile = this.fileRepository.create({
        name: filename,
        businessType: businessType,
        organisationId: organisation.id
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

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(id: number, path: string) {
    const fileToDelete = await this.findOne(id)
    const unlinkAsync = promisify(fs.unlink)
    await unlinkAsync(path)
    return await this.fileRepository.remove(fileToDelete)
  }
}
