import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { DataSource, Repository } from 'typeorm';
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { Batch } from '../batches/entities/batch.entity';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateProductionLineItemDto } from '../production-line-items/dto/create-production-line-item.dto';
import { ProductionLineItem } from '../production-line-items/entities/production-line-item.entity';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateScheduleDto } from '../schedules/dto/create-schedule.dto';
import { Schedule } from '../schedules/entities/schedule.entity';
import { ScheduleType } from '../schedules/enums/scheduleType.enum';
import { SchedulesService } from '../schedules/schedules.service';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { ProductionOrder } from './entities/production-order.entity';
import { ProductionOrderStatus } from './enums/production-order-status.enum';

@Injectable()
export class ProductionOrdersService {
  private readonly logger = new Logger(ProductionOrdersService.name)
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
    @InjectRepository(ProductionOrder)
    private readonly productionOrdersRepository: Repository<ProductionOrder>,
    @InjectRepository(ProductionLineItem)
    private readonly productionLineItemsRepository: Repository<ProductionLineItem>,
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
    @InjectRepository(BatchLineItem)
    private readonly batchLineItemsRepository: Repository<BatchLineItem>,
    private schedulerRegistry: SchedulerRegistry,
    private billOfMaterialsService: BillOfMaterialsService,
    private organisationsService: OrganisationsService,
    private rawMaterialsService: RawMaterialsService,
    private finalGoodsService: FinalGoodsService,
    private schedulesService: SchedulesService,
    private productionLinesService: ProductionLinesService,
    private batchLineItemsService: BatchLineItemsService,
    private datasource: DataSource
  ){}
  async create(createProductionOrderDto: CreateProductionOrderDto): Promise<ProductionOrder> {
    const { plannedQuantity, bomId, daily, organisationId, duration, purchaseOrderId } = createProductionOrderDto
    let bomToBeAdded: BillOfMaterial
    let newProductionOrder: ProductionOrder
    await this.datasource.manager.transaction(async (transactionalEntityManager) => {
      bomToBeAdded = await this.billOfMaterialsService.findOne(bomId)
      let finalGoodId: number = bomToBeAdded.finalGood.id
      if(daily){
        let schedules: CreateScheduleDto[];
        let schedulesToBeAdded: Schedule[] = [];
        schedules = await this.productionLinesService.retrieveSchedulesForProductionOrder(plannedQuantity, finalGoodId, daily, 0, organisationId)
        for (const dto of schedules){
          const {start, end, productionLineId} = dto
          const schedule: Schedule = transactionalEntityManager.create(Schedule,{
            start,
            end,
            productionLineId,
            status: ScheduleType.PLANNED,
            productionOrder: newProductionOrder
          })
          schedulesToBeAdded.push(await transactionalEntityManager.save(schedule)) 
          const startJob = new CronJob(this.dateToCron(start), async () => {
            this.update(newProductionOrder.id, {status : ProductionOrderStatus.ONGOING})
            this.schedulesService.update(schedule.id, {status : ScheduleType.ONGOING})
            this.logger.warn(`time (${start}) for start job ${schedule.id} to run!`);
          })
          const endJob = new CronJob(this.dateToCron(end), async () => {
            this.update(newProductionOrder.id, {status : ProductionOrderStatus.COMPLETED})
            this.schedulesService.update(schedule.id, {status : ScheduleType.COMPLETED})
            this.logger.warn(`time (${end}) for end job ${schedule.id} to run!`);
          })
          this.schedulerRegistry.addCronJob(`start ${schedule.id}`, startJob);
          startJob.start()
          this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
          endJob.start()
        }
        let prodLineItems: CreateProductionLineItemDto[];
        let prodLineItemsToBeAdded: ProductionLineItem[] = [];
        prodLineItems = await this.batchLineItemsService.getLineItems(bomId, plannedQuantity, organisationId)
        for (const dto of prodLineItems){
          const {quantity, sufficient, batchLineItemId, rawMaterial} = dto
          if (sufficient) {
            let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
              id: batchLineItemId
            })
            let rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterial.id
            })
            let prodLineItem: ProductionLineItem = transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              batchLineItem,
              sufficient,
              productionOrder: newProductionOrder,
              rawMaterial
            })
            
            await transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
            prodLineItemsToBeAdded.push(await transactionalEntityManager.save(prodLineItem))

          } else {
            let rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterial.id
            })
            let prodLineItem: ProductionLineItem = transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              rawMaterial: rawMaterialToBeAdded,
              sufficient,
              productionOrder: newProductionOrder
            })
            await transactionalEntityManager.save(prodLineItem)
          }
        }
        newProductionOrder = transactionalEntityManager.create(ProductionOrder, {
          plannedQuantity,
          daily,
          status: ProductionOrderStatus.RELEASED,
          bom: bomToBeAdded,
          schedules: schedulesToBeAdded,
          prodLineItems:prodLineItemsToBeAdded,
          organisationId
        })
        newProductionOrder = await transactionalEntityManager.save(newProductionOrder)
      } else {
        let finalStatus = ProductionOrderStatus.READYTORELEASE
        let prodLineItems: CreateProductionLineItemDto[];
        let prodLineItemsToBeAdded: ProductionLineItem[] = [];
        prodLineItems = await this.batchLineItemsService.getLineItems(bomId, plannedQuantity, organisationId)
        for (const dto of prodLineItems){
          const {quantity, sufficient, batchLineItemId, rawMaterial} = dto
          if (sufficient) {
            let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
              id: batchLineItemId
            })
            let rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterial.id
            })
            let prodLineItem: ProductionLineItem = transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              batchLineItem,
              sufficient,
              rawMaterial
            })
            
            await transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
            prodLineItemsToBeAdded.push(await transactionalEntityManager.save(prodLineItem))

          } else {
            finalStatus = ProductionOrderStatus.CREATED
            let rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterial.id
            })
            let prodLineItem: ProductionLineItem = transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              rawMaterial: rawMaterialToBeAdded,
              sufficient,
              productionOrder: newProductionOrder
            })
            prodLineItemsToBeAdded.push(await transactionalEntityManager.save(prodLineItem))
          }
        }
        // let schedules: CreateScheduleDto[];
        // let schedulesToBeAdded: Schedule[] = [];
        // schedules = await this.productionLinesService.retrieveSchedulesForProductionOrder(plannedQuantity, finalGoodId, daily, 0, organisationId)
        // for (const dto of schedules){
        //   const {start, end, productionLineId} = dto
        //   const schedule: Schedule = transactionalEntityManager.create(Schedule,{
        //     start,
        //     end,
        //     productionLineId,
        //     status: ScheduleType.PLANNED,
        //     productionOrder: newProductionOrder
        //   })
        //   schedulesToBeAdded.push(await transactionalEntityManager.save(schedule)) 
        //   console.log(newProductionOrder)
        //   const startJob = new CronJob(this.dateToCron(start), async () => {
        //     this.update(newProductionOrder.id, {status : ProductionOrderStatus.ONGOING})
        //     this.schedulesService.update(schedule.id, {status : ScheduleType.ONGOING})
        //     this.logger.warn(`time (${start}) for start job ${schedule.id} to run!`);
        //   })
        //   const endJob = new CronJob(this.dateToCron(end), async () => {
        //     this.update(newProductionOrder.id, {status : ProductionOrderStatus.COMPLETED})
        //     this.schedulesService.update(schedule.id, {status : ScheduleType.COMPLETED})
        //     this.logger.warn(`time (${end}) for end job ${schedule.id} to run!`);
        //   })
        //   this.schedulerRegistry.addCronJob(`start ${schedule.id}`, startJob);
        //   startJob.start()
        //   this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
        //   endJob.start()
        // }
        // console.log(prodLineItemsToBeAdded)
        newProductionOrder = transactionalEntityManager.create(ProductionOrder, {
          plannedQuantity,
          daily,
          status:finalStatus,
          bom: bomToBeAdded,
          schedules: [],
          prodLineItems:prodLineItemsToBeAdded,
          organisationId
        })
        return await transactionalEntityManager.save(newProductionOrder)
      }   
      // return null;
      
    })
    return this.findOne(newProductionOrder.id)
  }

  findAll() {
    return this.productionOrdersRepository.find({
      relations: {
        bom: true,
        completedGoods: true,
        schedules: true,
        prodLineItems: true,
        purchaseOrder: true,
        organisation: true
      }
    })
  }

  findAllByOrgId(organisationId: number): Promise<ProductionOrder[]> {
    return this.productionOrdersRepository.find({
      where: {
        organisationId
      }, relations: {
        bom: true,
        completedGoods: true,
        schedules: true,
        prodLineItems: {
          batchLineItem: true,
          rawMaterial: true
        },
        purchaseOrder: true,
        organisation: true
      }
    })
  }

  async findOne(id: number): Promise<ProductionOrder> {
    try {
      let productionOrder: ProductionOrder = await this.productionOrdersRepository.findOneOrFail({where: {
        id
      }, relations: {
        bom: {
          finalGood: true
        },
        completedGoods: true,
        schedules: true,
        prodLineItems: {
          batchLineItem: true,
          rawMaterial: true
        },
        purchaseOrder: true,
        organisation: true
      }})
      
      if (productionOrder.status == ProductionOrderStatus.CREATED || productionOrder.status == ProductionOrderStatus.READYTORELEASE) {
        let newProdLineItems: ProductionLineItem[] = []
        let prodLineItems: CreateProductionLineItemDto[] = []
        await this.datasource.manager.transaction(async (transactionalEntityManager) => {
          for(const lineItem of productionOrder.prodLineItems) {
            if (lineItem.sufficient && lineItem.batchLineItem) {
              transactionalEntityManager.update(BatchLineItem, lineItem.batchLineItem.id, { reservedQuantity: lineItem.batchLineItem.reservedQuantity-lineItem.quantity })
            }
            transactionalEntityManager.remove(lineItem)
          }
          prodLineItems = await this.batchLineItemsService.getLineItems(productionOrder.bom.id, productionOrder.plannedQuantity, productionOrder.organisationId)
          for (const dto of prodLineItems){
            const {quantity, sufficient, batchLineItemId, rawMaterial} = dto
            if (sufficient) {
              let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
                id: batchLineItemId
              })
              let rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
                id: rawMaterial.id
              })
              let prodLineItem = await transactionalEntityManager.create(ProductionLineItem, {
                quantity,
                sufficient,
                batchLineItem,
                rawMaterial: rawMaterialToBeAdded,
                productionOrder
              })
              await transactionalEntityManager.save(prodLineItem)
              await transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
            } else if (!sufficient) {
              let rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
                id: rawMaterial.id
              })
              let prodLineItem = transactionalEntityManager.create(ProductionLineItem, {
                quantity,
                sufficient,
                rawMaterial: rawMaterialToBeAdded,
                productionOrder
              })
              await transactionalEntityManager.save(prodLineItem)
            }
          }
          return null
        })
      }
      
      return this.productionOrdersRepository.findOneOrFail({where: {
        id
      }, relations: {
        bom: {
          finalGood: true
        },
        completedGoods: true,
        schedules: true,
        prodLineItems: {
          batchLineItem: true,
          rawMaterial: true
        },
        purchaseOrder: true,
        organisation: true
      }})
    } catch (error) {
      throw new NotFoundException('Production Order not found')
    }
  }

  async update(id: number, updateProductionOrderDto: UpdateProductionOrderDto): Promise<ProductionOrder> {
    const productionOrderToUpdate = await this.findOne(id)
    const arrayOfKeyValues = Object.entries(updateProductionOrderDto)
    arrayOfKeyValues.forEach(async ([key, value]) => {
      if(key == 'status'){
        if (value == ProductionOrderStatus.RELEASED) {
          await this.datasource.manager.transaction(async (transactionalEntityManager) => {
            let schedules: CreateScheduleDto[];
            let schedulesToBeAdded: Schedule[] = [];
            schedules = await this.productionLinesService.retrieveSchedulesForProductionOrder(productionOrderToUpdate.plannedQuantity, productionOrderToUpdate.bom.finalGood.id, productionOrderToUpdate.daily, 0, productionOrderToUpdate.organisationId)
            for (const dto of schedules){
              const {start, end, productionLineId} = dto
              const schedule: Schedule = transactionalEntityManager.create(Schedule,{
                start,
                end,
                productionLineId,
                status: ScheduleType.PLANNED,
                productionOrder: productionOrderToUpdate
              })
              schedulesToBeAdded.push(await transactionalEntityManager.save(schedule)) 
              const startJob = new CronJob(this.dateToCron(start), async () => {
                this.update(productionOrderToUpdate.id, {status : ProductionOrderStatus.ONGOING})
                this.schedulesService.update(schedule.id, {status : ScheduleType.ONGOING})
                this.logger.warn(`time (${start}) for start job ${schedule.id} to run!`);
              })
              const endJob = new CronJob(this.dateToCron(end), async () => {
                this.update(productionOrderToUpdate.id, {status : ProductionOrderStatus.COMPLETED})
                this.schedulesService.update(schedule.id, {status : ScheduleType.COMPLETED})
                this.logger.warn(`time (${end}) for end job ${schedule.id} to run!`);
              })
              this.schedulerRegistry.addCronJob(`start ${schedule.id}`, startJob);
              startJob.start()
              this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
              endJob.start()
            }
            return await transactionalEntityManager.update(ProductionOrder, id, {status: value})
          })
          
        } else if(value == ProductionOrderStatus.ONGOING) {
          await this.datasource.manager.transaction(async (transactionalEntityManager) => {

            for (const lineItem of productionOrderToUpdate.prodLineItems){
              await transactionalEntityManager.update(BatchLineItem, lineItem.batchLineItem.id, {reservedQuantity: lineItem.batchLineItem.reservedQuantity-lineItem.quantity, quantity: lineItem.batchLineItem.quantity-lineItem.quantity})
              await transactionalEntityManager.save(lineItem)
            }
            return await transactionalEntityManager.update(ProductionOrder, id, {status: value})
          })
        }
      }
    })
    return this.findOne(id)
  }

  async remove(id: number): Promise<ProductionOrder> {
    const productionOrderToRemove = await this.productionOrdersRepository.findOneBy({id})
    return this.productionOrdersRepository.remove(productionOrderToRemove)
  }

  dateToCron(date: Date): string {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth();
    const dayOfWeek = date.getDay();

    return `${seconds} ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  }
}
