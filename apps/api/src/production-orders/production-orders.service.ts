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
    const { plannedQuantity, bomId, status, daily, organisationId, duration, purchaseOrderId } = createProductionOrderDto
    let bomToBeAdded: BillOfMaterial
    let newProductionOrder: ProductionOrder
    await this.datasource.manager.transaction(async (transactionalEntityManager) => {
      bomToBeAdded = await this.billOfMaterialsService.findOne(bomId)
      let finalGoodId: number = bomToBeAdded.finalGood.id
      if (daily) {
        newProductionOrder = transactionalEntityManager.create(ProductionOrder, {
          plannedQuantity,
          daily,
          status,
          bom: bomToBeAdded,
          schedules:[],
          prodLineItems:[],
          organisationId
        })
        let schedules: CreateScheduleDto[];
        schedules = await this.productionLinesService.retrieveSchedulesForProductionOrder(plannedQuantity, finalGoodId, daily, duration)
        console.log(schedules)
        for (const dto of schedules){
          const {start, end, productionLineId} = dto
          const schedule: Schedule = transactionalEntityManager.create(Schedule,{
            start,
            end,
            productionLineId,
            status: ScheduleType.PLANNED,
            productionOrder: newProductionOrder
          })
          const startJob = new CronJob(this.dateToCron(start), async () => {
            this.update(newProductionOrder.id, {status : ProductionOrderStatus.ONGOING})
            this.schedulesService.update(schedule.id, {status : ScheduleType.ONGOING})
            this.logger.warn(`time (${start}) for start job ${newProductionOrder.id} to run!`);
          })
          const endJob = new CronJob(this.dateToCron(end), async () => {
            this.update(newProductionOrder.id, {status : ProductionOrderStatus.COMPLETED})
            this.schedulesService.update(schedule.id, {status : ScheduleType.COMPLETED})
            this.logger.warn(`time (${end}) for end job ${newProductionOrder.id} to run!`);
          })
          this.schedulerRegistry.addCronJob(`start ${newProductionOrder.id}`, startJob);
          startJob.start()
          this.schedulerRegistry.addCronJob(`end ${newProductionOrder.id}`, endJob);
          endJob.start()
        }
        let prodLineItems: CreateProductionLineItemDto[];
        prodLineItems = await this.batchLineItemsService.getLineItems(bomId, plannedQuantity, organisationId)
        console.log(prodLineItems)
        for (const dto of prodLineItems){
          const {quantity, sufficient, batchLineItemId, rawMaterialId} = dto
          if (batchLineItemId && sufficient) {
            let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
              id: batchLineItemId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              sufficient,
              batchLineItem,
              productionOrder: newProductionOrder
            })
            transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
          } else if (rawMaterialId && !sufficient) {
            let rawMaterial = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterialId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              sufficient,
              rawMaterial,
              productionOrder: newProductionOrder
            })
          }
        }
      } else if (status == ProductionOrderStatus.CREATED) {
        newProductionOrder = transactionalEntityManager.create(ProductionOrder, {
          plannedQuantity,
          daily,
          status,
          bom: bomToBeAdded,
          schedules:[],
          prodLineItems:[],
          organisationId
        })
        let prodLineItems: CreateProductionLineItemDto[];
        prodLineItems = await this.batchLineItemsService.getLineItems(bomId, plannedQuantity, organisationId)
        for (const dto of prodLineItems){
          const {quantity, sufficient, batchLineItemId, rawMaterialId} = dto
          if (batchLineItemId && sufficient) {
            let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
              id: batchLineItemId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              sufficient,
              batchLineItem,
              productionOrder: newProductionOrder
            })
            transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
          } else if (rawMaterialId && !sufficient) {
            let rawMaterial = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterialId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              sufficient,
              rawMaterial,
              productionOrder: newProductionOrder
            })
          }
        }
      } else if (status == ProductionOrderStatus.RELEASED) {
        newProductionOrder = transactionalEntityManager.create(ProductionOrder, {
          plannedQuantity,
          daily,
          status,
          bom: bomToBeAdded,
          schedules:[],
          prodLineItems:[],
          organisationId
        })
        let schedules: CreateScheduleDto[];
        schedules = await this.productionLinesService.retrieveSchedulesForProductionOrder(plannedQuantity, finalGoodId, daily, 0)
        console.log(schedules)
        for (const dto of schedules){
          const {start, end, productionLineId} = dto
          const schedule: Schedule = transactionalEntityManager.create(Schedule,{
            start,
            end,
            productionLineId,
            status: ScheduleType.PLANNED,
            productionOrder: newProductionOrder
          })
          const startJob = new CronJob(this.dateToCron(start), async () => {
            this.update(newProductionOrder.id, {status : ProductionOrderStatus.ONGOING})
            this.schedulesService.update(schedule.id, {status : ScheduleType.ONGOING})
            this.logger.warn(`time (${start}) for start job ${newProductionOrder.id} to run!`);
          })
          const endJob = new CronJob(this.dateToCron(end), async () => {
            this.update(newProductionOrder.id, {status : ProductionOrderStatus.COMPLETED})
            this.schedulesService.update(schedule.id, {status : ScheduleType.COMPLETED})
            this.logger.warn(`time (${end}) for end job ${newProductionOrder.id} to run!`);
          })
          this.schedulerRegistry.addCronJob(`start ${newProductionOrder.id}`, startJob);
          startJob.start()
          this.schedulerRegistry.addCronJob(`end ${newProductionOrder.id}`, endJob);
          endJob.start()
        }
        let prodLineItems: CreateProductionLineItemDto[];
        prodLineItems = await this.batchLineItemsService.getLineItems(bomId, plannedQuantity, organisationId)
        console.log(prodLineItems)
        for (const dto of prodLineItems){
          const {quantity, sufficient, batchLineItemId, rawMaterialId} = dto
          if (batchLineItemId) {
            let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
              id: batchLineItemId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              batchLineItem,
              sufficient: true,
              productionOrder: newProductionOrder
            })
            transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
          } else {
            let rawMaterial = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterialId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              rawMaterial,
              sufficient: false,
              productionOrder: newProductionOrder
            })
          }
        }
      }
      return transactionalEntityManager.save(newProductionOrder)
      
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
          batchLineItem: true
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
          batchLineItem: true
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
            const {quantity, sufficient, batchLineItemId, rawMaterialId} = dto
            if (batchLineItemId && sufficient) {
              let batchLineItem = await transactionalEntityManager.findOneByOrFail(BatchLineItem, {
                id: batchLineItemId
              })
              transactionalEntityManager.create(ProductionLineItem, {
                quantity,
                sufficient,
                batchLineItem,
                productionOrder
              })
            transactionalEntityManager.update(BatchLineItem, batchLineItemId, { reservedQuantity: batchLineItem.reservedQuantity+quantity })
          } else if (rawMaterialId && !sufficient) {
            let rawMaterial = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterialId
            })
            transactionalEntityManager.create(ProductionLineItem, {
              quantity,
              sufficient,
              rawMaterial,
              productionOrder
            })
          }
        }
        })
      }
      return productionOrder
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
            schedules = await this.productionLinesService.retrieveSchedulesForProductionOrder(productionOrderToUpdate.plannedQuantity, productionOrderToUpdate.bom.finalGood.id, productionOrderToUpdate.daily, 0)
            for (const dto of schedules){
              const {start, end, productionLineId} = dto
              const schedule: Schedule = transactionalEntityManager.create(Schedule,{
                start,
                end,
                productionLineId,
                status: ScheduleType.PLANNED,
                productionOrder: productionOrderToUpdate
              })
              const startJob = new CronJob(this.dateToCron(start), async () => {
                this.update(productionOrderToUpdate.id, {status : ProductionOrderStatus.ONGOING})
                this.schedulesService.update(schedule.id, {status : ScheduleType.ONGOING})
                this.logger.warn(`time (${start}) for start job ${productionOrderToUpdate.id} to run!`);
              })
              const endJob = new CronJob(this.dateToCron(end), async () => {
                this.update(productionOrderToUpdate.id, {status : ProductionOrderStatus.COMPLETED})
                this.schedulesService.update(schedule.id, {status : ScheduleType.COMPLETED})
                this.logger.warn(`time (${end}) for end job ${productionOrderToUpdate.id} to run!`);
              })
              this.schedulerRegistry.addCronJob(`start ${productionOrderToUpdate.id}`, startJob);
              startJob.start()
              this.schedulerRegistry.addCronJob(`end ${productionOrderToUpdate.id}`, endJob);
              endJob.start()
            }
          })
          
        } else if(value == ProductionOrderStatus.ONGOING) {
          await this.datasource.manager.transaction(async (transactionalEntityManager) => {
            for (const lineItem of productionOrderToUpdate.prodLineItems){
              transactionalEntityManager.update(BatchLineItem, lineItem.batchLineItem.id, {reservedQuantity: lineItem.batchLineItem.reservedQuantity-lineItem.quantity, quantity: lineItem.batchLineItem.quantity-lineItem.quantity})
            }
          })
        }
      }
      productionOrderToUpdate[key] = value
    })
    return this.productionOrdersRepository.save(productionOrderToUpdate)
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
