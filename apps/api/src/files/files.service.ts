import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as papaparse from 'papaparse';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreatePurchaseOrderLineItemDto } from '../purchase-order-line-items/dto/create-purchase-order-line-item.dto';
import { CreatePurchaseOrderDto } from '../purchase-orders/dto/create-purchase-order.dto';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { File } from './entities/file.entity';
import { BusinessType } from './enums/businessType.enum';

@Injectable()
export class FilesService {
  constructor(private organisationService: OrganisationsService,
  @InjectRepository(File)
  private readonly fileRepository: Repository<File>,
  private applicationService: ApplicationsService,
  private finalGoodsService: FinalGoodsService,
  private purchaseOrderService: PurchaseOrdersService){}
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

  async uploadAndCreateFiles(files: Express.Multer.File[], uploadFileDto: UploadFileDto) {
	console.log(files)
    let organisationToBeAdded: Organisation
    let applicationToBeAdded: Application
    let finalGoodToBeAdded: FinalGood
    const {organisationId, applicationId, finalGoodId, type} = uploadFileDto
    organisationToBeAdded = organisationId ? await this.organisationService.findOne(organisationId) : null
    applicationToBeAdded = applicationId ? await this.applicationService.findOne(applicationId) : null
    finalGoodToBeAdded = finalGoodId ? await this.finalGoodsService.findOne(finalGoodId) : null
    const newFiles = []
    for (const file of files) {
      const { filename } = file
      const newFile = this.fileRepository.create({
        name: filename,
        businessType: type,
        organisationId: organisationToBeAdded ? organisationToBeAdded.id : null,
        applicationId: applicationToBeAdded ? applicationToBeAdded.id : null,
        finalGood: finalGoodToBeAdded ?? null
      })
      newFiles.push(await this.fileRepository.save(newFile))
    }
    return newFiles
  }

  async uploadPurchaseCSV(file: Express.Multer.File, id: number) {
    const csvFile = file.buffer;
    const data = csvFile.toString();
    const parsedCsv = await papaparse.parse(data, {
      header: false,
      skipEmptyLine: true,
      complete: (results) => results.data
    });
    // console.log(parsedCsv.data)
    const cleanedData = parsedCsv.data.slice(1);
    const map = new Map<number, any>();
    const mapPurchaseDto = new Map<number, any>();

    for (const entry of cleanedData) {
      if (map.has(entry[6])) {
        const arr = map.get(entry[6]);
        arr.push({
          quantity: entry[3],
          price: entry[4],
          finalGoodId: entry[5]
        });
        map.set(entry[6], arr);
      } else {
        const purchaseOrderDto = new CreatePurchaseOrderDto();
        purchaseOrderDto.deliveryAddress = entry[0];
        purchaseOrderDto.totalPrice = entry[1];
        purchaseOrderDto.currentOrganisationId = id;
        // console.log(new Date(entry[2]) + " " + entry[2])
        purchaseOrderDto.date = new Date(entry[2]);
        mapPurchaseDto.set(entry[6], purchaseOrderDto);
        const arr = [];
        arr.push({
          quantity: entry[3],
          price: entry[4],
          finalGoodId: entry[5]
        })
        map.set(entry[6], arr);
      }
    }
    for (const [key, value] of map.entries()) {
      const purchaseOrderDto = mapPurchaseDto.get(key);
      const poLineItems: CreatePurchaseOrderLineItemDto[] = [];
      for (const lineDto of value) {
        const createPOLineDto = new CreatePurchaseOrderLineItemDto();
        createPOLineDto.finalGoodId = lineDto.finalGoodId;
        createPOLineDto.price = lineDto.price;
        createPOLineDto.quantity = lineDto.quantity
        poLineItems.push(createPOLineDto);
      }
      purchaseOrderDto.poLineItemDtos = poLineItems;
      this.purchaseOrderService.createCSV(purchaseOrderDto);
    }
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
