import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import * as dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { Batch } from '../batches/entities/batch.entity';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { ChronJobsService } from '../chron-jobs/chron-jobs.service';
import { ChronJob } from '../chron-jobs/entities/chron-job.entity';
import { ChronType } from '../chron-jobs/enums/chronType.enum';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateProductionLineItemDto } from '../production-line-items/dto/create-production-line-item.dto';
import { ProductionBatchLineDto } from '../production-line-items/dto/production-batch-line.dto';
import { ProductionLineItem } from '../production-line-items/entities/production-line-item.entity';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { ProductionRequest } from '../production-requests/entities/production-request.entity';
import { ProdRequestStatus } from '../production-requests/enums/prodRequestStatus.enum';
import { ProductionRequestsService } from '../production-requests/production-requests.service';
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
  private readonly logger = new Logger(ProductionOrdersService.name);
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
    private datasource: DataSource,
    @Inject(forwardRef(() => ChronJobsService))
    private chronJobsService: ChronJobsService,
    @Inject(forwardRef(() => ProductionRequestsService))
    private prodRequestsService: ProductionRequestsService
  ) {}
  async create(
    createProductionOrderDto: CreateProductionOrderDto
  ): Promise<ProductionOrder> {
    const {
      plannedQuantity,
      bomId,
      daily,
      organisationId,
      duration,
      prodRequestId,
    } = createProductionOrderDto;
    let bomToBeAdded: BillOfMaterial;
    let newProductionOrder: ProductionOrder;
    let scheduleDtos: CreateScheduleDto[];
    let prodLineItemDtos: CreateProductionLineItemDto[];
    let schedulesToBeAdded: Schedule[] = [];
    let prodLineItemsToBeAdded: ProductionLineItem[] = [];
    bomToBeAdded = await this.billOfMaterialsService.findOne(bomId);
    let finalGoodId: number = bomToBeAdded.finalGood.id;
    await this.datasource.manager.transaction(
      async (transactionalEntityManager) => {
        let prodRequest = null;

        if (prodRequestId) {
          prodRequest = await this.prodRequestsService.findOne(prodRequestId);
          await transactionalEntityManager.update(
            ProductionRequest,
            prodRequestId,
            { status: ProdRequestStatus.PROCESSING }
          );
        }
		
		console.log(prodRequest)
		
		prodRequest = await transactionalEntityManager.findOne(ProductionRequest, {
			where: {
			  id: prodRequestId
			}, relations: {
			  purchaseOrder: true,
			  finalGood: true,
			  prodOrders: true
			}
		})

		console.log(prodRequest)

        if (daily) {
          scheduleDtos =
            await this.productionLinesService.retrieveSchedulesForProductionOrder(
              plannedQuantity * bomToBeAdded.finalGood.lotQuantity,
              finalGoodId,
              daily,
              duration,
              organisationId
            );
          let latestDate: Date =
            scheduleDtos.length > 0
              ? scheduleDtos[scheduleDtos.length - 1].end
              : null;
          prodLineItemDtos = await this.batchLineItemsService.getLineItems(
            bomId,
            plannedQuantity * duration,
            organisationId,
            latestDate
          );
          for (const dto of prodLineItemDtos) {
            const { quantity, sufficient, batchLineItemId, rawMaterial } = dto;
            if (sufficient) {
              let batchLineItem =
                await transactionalEntityManager.findOneByOrFail(
                  BatchLineItem,
                  {
                    id: batchLineItemId,
                  }
                );
              let rawMaterialToBeAdded =
                await transactionalEntityManager.findOneByOrFail(RawMaterial, {
                  id: rawMaterial.id,
                });
              let prodLineItem: ProductionLineItem =
                transactionalEntityManager.create(ProductionLineItem, {
                  quantity,
                  batchLineItem,
                  sufficient,
                  rawMaterial: rawMaterialToBeAdded,
                });
              await transactionalEntityManager.update(
                BatchLineItem,
                batchLineItemId,
                { reservedQuantity: batchLineItem.reservedQuantity + quantity }
              );
              prodLineItemsToBeAdded.push(
                await transactionalEntityManager.save(prodLineItem)
              );
            } else if (!sufficient) {
              throw new NotFoundException('Not enough stock!');
            }
          }
          for (const dto of scheduleDtos) {
            const { start, end, productionLineId } = dto;
            const schedule: Schedule = transactionalEntityManager.create(
              Schedule,
              {
                start,
                end,
                productionLineId,
                status: ScheduleType.PLANNED,
                prodLineItems: [],
              }
            );
            schedulesToBeAdded.push(
              await transactionalEntityManager.save(schedule)
            );
          }
          for (const bomLineItem of bomToBeAdded.bomLineItems) {
            let current = 0;
            let target = 0;
            for (const schedule of schedulesToBeAdded) {
              const prodLine = await this.productionLinesService.findOne(
                schedule.productionLineId
              );
              const duration =
                (schedule.end.getTime() - schedule.start.getTime()) / 3600000;
              let start = target;
              target +=
                (prodLine.outputPerHour / bomToBeAdded.finalGood.lotQuantity) *
                duration *
                bomLineItem.quantity;

              for (const prodLineItem of prodLineItemsToBeAdded) {
                if (prodLineItem.rawMaterial.id == bomLineItem.rawMaterial.id) {
                  if (prodLineItem.quantity < target - current) {
                    current += prodLineItem.quantity;
                  } else {
                    current = target;
                  }
                  if (start < current) {
                    schedule.prodLineItems.push(prodLineItem);
                  }
                  if (current == target) {
                    break;
                  }
                }
              }
            }
          }
          for (const schedule of schedulesToBeAdded) {
            await transactionalEntityManager.save(schedule);
          }
          newProductionOrder = transactionalEntityManager.create(
            ProductionOrder,
            {
              plannedQuantity,
              daily,
              status: ProductionOrderStatus.RELEASED,
              bom: bomToBeAdded,
              schedules: schedulesToBeAdded,
              prodLineItems: prodLineItemsToBeAdded,
              organisationId,
              prodRequest,
            }
          );
          newProductionOrder = await transactionalEntityManager.save(
            newProductionOrder
          );
          for (const schedule of schedulesToBeAdded) {
            const startJob = new CronJob(schedule.start, async () => {
              this.update(newProductionOrder.id, {
                status: ProductionOrderStatus.ONGOING,
              });
              this.schedulesService.update(schedule.id, {
                status: ScheduleType.ONGOING,
              });
              this.logger.warn(
                `time (${schedule.start}) for start job ${schedule.id} to run!`
              );
            });
            const endJob = new CronJob(schedule.end, async () => {
              this.schedulesService.update(schedule.id, {
                status: ScheduleType.COMPLETED,
              });
              let checker = true;
              let prodO: ProductionOrder = await this.findOne(
                schedule.productionOrder.id
              );
              for (const sche of prodO.schedules) {
                if (
                  !(sche.status == ScheduleType.COMPLETED) &&
                  !(sche.status == ScheduleType.ALLOCATED)
                ) {
                  checker = false;
                }
              }
              if (checker) {
                await transactionalEntityManager.update(
                  ProductionOrder,
                  prodO.id,
                  { status: ProductionOrderStatus.COMPLETED }
                );
              }
              this.logger.warn(
                `time (${schedule.end}) for end job ${schedule.id} to run!`
              );
            });
            this.schedulerRegistry.addCronJob(`start ${schedule.id}`, startJob);
            startJob.start();
            this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
            endJob.start();
            let chron1 = await transactionalEntityManager.create(ChronJob, {
              scheduledDate: schedule.start,
              type: ChronType.SCHEDULESTART,
              targetId: schedule.id,
            });
            let chron2 = await transactionalEntityManager.create(ChronJob, {
              scheduledDate: schedule.end,
              type: ChronType.SCHEDULEEND,
              targetId: schedule.id,
            });
            await transactionalEntityManager.save(chron1);
            await transactionalEntityManager.save(chron2);
          }
        } else {
          scheduleDtos =
            await this.productionLinesService.retrieveSchedulesForProductionOrder(
              plannedQuantity * bomToBeAdded.finalGood.lotQuantity,
              finalGoodId,
              daily,
              0,
              organisationId
            );
          let latestDate: Date = scheduleDtos[scheduleDtos.length - 1].end;
          prodLineItemDtos = await this.batchLineItemsService.getLineItems(
            bomId,
            plannedQuantity,
            organisationId,
            latestDate
          );
          let insufficientLineItems: ProductionLineItem[] = [];
          let rawMaterialCount: number = 0;
          let bomMaterialCount: number = 0;
          for (const lineItem of bomToBeAdded.bomLineItems) {
            bomMaterialCount += lineItem.quantity;
          }
          for (const dto of prodLineItemDtos) {
            const { quantity, sufficient, batchLineItemId, rawMaterial } = dto;
            if (sufficient) {
              let batchLineItem =
                await transactionalEntityManager.findOneByOrFail(
                  BatchLineItem,
                  {
                    id: batchLineItemId,
                  }
                );
              let rawMaterialToBeAdded =
                await transactionalEntityManager.findOneByOrFail(RawMaterial, {
                  id: rawMaterial.id,
                });
              let prodLineItem: ProductionLineItem =
                transactionalEntityManager.create(ProductionLineItem, {
                  quantity,
                  batchLineItem,
                  sufficient,
                  rawMaterial: rawMaterialToBeAdded,
                });
              await transactionalEntityManager.update(
                BatchLineItem,
                batchLineItemId,
                { reservedQuantity: batchLineItem.reservedQuantity + quantity }
              );
              prodLineItemsToBeAdded.push(
                await transactionalEntityManager.save(prodLineItem)
              );
              rawMaterialCount += quantity;
            } else if (!sufficient) {
              let rawMaterialToBeAdded =
                await transactionalEntityManager.findOneByOrFail(RawMaterial, {
                  id: rawMaterial.id,
                });
              let prodLineItem: ProductionLineItem =
                transactionalEntityManager.create(ProductionLineItem, {
                  quantity,
                  sufficient,
                  rawMaterial: rawMaterialToBeAdded,
                });
              insufficientLineItems.push(
                await transactionalEntityManager.save(prodLineItem)
              );
            }
          }
          let plannedMaterialCount: number = bomMaterialCount * plannedQuantity;
          if (plannedMaterialCount == rawMaterialCount) {
            for (const dto of scheduleDtos) {
              const { start, end, productionLineId } = dto;
              const schedule: Schedule = transactionalEntityManager.create(
                Schedule,
                {
                  start,
                  end,
                  productionLineId,
                  status: ScheduleType.PLANNED,
                  prodLineItems: [],
                }
              );
              schedulesToBeAdded.push(
                await transactionalEntityManager.save(schedule)
              );
            }
            for (const bomLineItem of bomToBeAdded.bomLineItems) {
              let current = 0;
              let target = 0;
              for (const schedule of schedulesToBeAdded) {
                const prodLine = await this.productionLinesService.findOne(
                  schedule.productionLineId
                );
                const duration =
                  (schedule.end.getTime() - schedule.start.getTime()) / 3600000;
                let start = target;
                target +=
                  (prodLine.outputPerHour /
                    bomToBeAdded.finalGood.lotQuantity) *
                  duration *
                  bomLineItem.quantity;

                for (const prodLineItem of prodLineItemsToBeAdded) {
                  if (
                    prodLineItem.rawMaterial.id == bomLineItem.rawMaterial.id
                  ) {
                    if (prodLineItem.quantity < target - current) {
                      current += prodLineItem.quantity;
                    } else {
                      current = target;
                    }
                    if (start < current) {
                      schedule.prodLineItems.push(prodLineItem);
                    }
                    if (current == target) {
                      break;
                    }
                  }
                }
              }
            }
            for (const schedule of schedulesToBeAdded) {
              await transactionalEntityManager.save(schedule);
            }

            newProductionOrder = transactionalEntityManager.create(
              ProductionOrder,
              {
                plannedQuantity,
                daily,
                status: ProductionOrderStatus.RELEASED,
                bom: bomToBeAdded,
                schedules: schedulesToBeAdded,
                prodLineItems: prodLineItemsToBeAdded,
                organisationId,
                prodRequest,
              }
            );

            newProductionOrder = await transactionalEntityManager.save(
              newProductionOrder
            );
            for (const schedule of schedulesToBeAdded) {
              const startJob = new CronJob(schedule.start, async () => {
                await this.schedulesService.update(schedule.id, {
                  status: ScheduleType.ONGOING,
                });
                await this.update(newProductionOrder.id, {
                  status: ProductionOrderStatus.ONGOING,
                });
                this.logger.warn(
                  `time (${schedule.start}) for start job ${schedule.id} to run!`
                );
              });
              const endJob = new CronJob(schedule.end, async () => {
                await this.schedulesService.update(schedule.id, {
                  status: ScheduleType.COMPLETED,
                });
                let checker = true;
                let prodO: ProductionOrder = await this.findOne(
                  schedule.productionOrder.id
                );
                for (const sche of prodO.schedules) {
                  if (
                    !(sche.status == ScheduleType.COMPLETED) &&
                    !(sche.status == ScheduleType.ALLOCATED)
                  ) {
                    checker = false;
                  }
                }
                if (checker) {
                  await transactionalEntityManager.update(
                    ProductionOrder,
                    prodO.id,
                    { status: ProductionOrderStatus.COMPLETED }
                  );
                }

                this.logger.warn(
                  `time (${schedule.end}) for end job ${schedule.id} to run!`
                );
              });
              this.schedulerRegistry.addCronJob(
                `start ${schedule.id}`,
                startJob
              );
              startJob.start();
              this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
              endJob.start();
              let chron1 = await transactionalEntityManager.create(ChronJob, {
                scheduledDate: schedule.start,
                type: ChronType.SCHEDULESTART,
                targetId: schedule.id,
              });
              let chron2 = await transactionalEntityManager.create(ChronJob, {
                scheduledDate: schedule.end,
                type: ChronType.SCHEDULEEND,
                targetId: schedule.id,
              });
              await transactionalEntityManager.save(chron1);
              await transactionalEntityManager.save(chron2);
            }
          } else {
            let possibleQuantity: number = rawMaterialCount / bomMaterialCount;
            if (possibleQuantity > 0) {
              scheduleDtos =
                await this.productionLinesService.retrieveSchedulesForProductionOrder(
                  possibleQuantity * bomToBeAdded.finalGood.lotQuantity,
                  finalGoodId,
                  daily,
                  0,
                  organisationId
                );
              for (const dto of scheduleDtos) {
                const { start, end, productionLineId } = dto;
                const schedule: Schedule = transactionalEntityManager.create(
                  Schedule,
                  {
                    start,
                    end,
                    productionLineId,
                    status: ScheduleType.PLANNED,
                    prodLineItems: [],
                  }
                );
                schedulesToBeAdded.push(
                  await transactionalEntityManager.save(schedule)
                );
              }
              for (const bomLineItem of bomToBeAdded.bomLineItems) {
                let current = 0;
                let target = 0;
                for (const schedule of schedulesToBeAdded) {
                  const prodLine = await this.productionLinesService.findOne(
                    schedule.productionLineId
                  );
                  const duration =
                    (schedule.end.getTime() - schedule.start.getTime()) /
                    3600000;
                  let start = target;
                  target +=
                    (prodLine.outputPerHour /
                      bomToBeAdded.finalGood.lotQuantity) *
                    duration *
                    bomLineItem.quantity;

                  for (const prodLineItem of prodLineItemsToBeAdded) {
                    if (
                      prodLineItem.rawMaterial.id == bomLineItem.rawMaterial.id
                    ) {
                      if (prodLineItem.quantity < target - current) {
                        current += prodLineItem.quantity;
                      } else {
                        current = target;
                      }
                      if (start < current) {
                        schedule.prodLineItems.push(prodLineItem);
                      }
                      if (current == target) {
                        break;
                      }
                    }
                  }
                }
              }
              for (const schedule of schedulesToBeAdded) {
                await transactionalEntityManager.save(schedule);
              }
              newProductionOrder = transactionalEntityManager.create(
                ProductionOrder,
                {
                  plannedQuantity: possibleQuantity,
                  daily,
                  status: ProductionOrderStatus.RELEASED,
                  bom: bomToBeAdded,
                  schedules: schedulesToBeAdded,
                  prodLineItems: prodLineItemsToBeAdded,
                  organisationId,
                  prodRequest,
                }
              );
              newProductionOrder = await transactionalEntityManager.save(
                newProductionOrder
              );
              for (const schedule of schedulesToBeAdded) {
                const startJob = new CronJob(schedule.start, async () => {
                  this.update(newProductionOrder.id, {
                    status: ProductionOrderStatus.ONGOING,
                  });
                  this.schedulesService.update(schedule.id, {
                    status: ScheduleType.ONGOING,
                  });
                  this.logger.warn(
                    `time (${schedule.start}) for start job ${schedule.id} to run!`
                  );
                });
                const endJob = new CronJob(schedule.end, async () => {
                  this.schedulesService.update(schedule.id, {
                    status: ScheduleType.COMPLETED,
                  });
                  let checker = true;
                  let prodO: ProductionOrder = await this.findOne(
                    schedule.productionOrder.id
                  );
                  for (const sche of prodO.schedules) {
                    if (
                      !(sche.status == ScheduleType.COMPLETED) &&
                      !(sche.status == ScheduleType.ALLOCATED)
                    ) {
                      checker = false;
                    }
                  }
                  if (checker) {
                    await transactionalEntityManager.update(
                      ProductionOrder,
                      prodO.id,
                      { status: ProductionOrderStatus.COMPLETED }
                    );
                  }
                  this.logger.warn(
                    `time (${schedule.end}) for end job ${schedule.id} to run!`
                  );
                });
                this.schedulerRegistry.addCronJob(
                  `start ${schedule.id}`,
                  startJob
                );
                startJob.start();
                this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
                endJob.start();
                let chron1 = await transactionalEntityManager.create(ChronJob, {
                  scheduledDate: schedule.start,
                  type: ChronType.SCHEDULESTART,
                  targetId: schedule.id,
                });
                let chron2 = await transactionalEntityManager.create(ChronJob, {
                  scheduledDate: schedule.end,
                  type: ChronType.SCHEDULEEND,
                  targetId: schedule.id,
                });
                await transactionalEntityManager.save(chron1);
                await transactionalEntityManager.save(chron2);
              }
            }

            let remainingQuantity: number = plannedQuantity - possibleQuantity;
            let createdProductionOrder: ProductionOrder =
              transactionalEntityManager.create(ProductionOrder, {
                plannedQuantity: remainingQuantity,
                daily,
                status: ProductionOrderStatus.CREATED,
                bom: bomToBeAdded,
                schedules: [],
                prodLineItems: insufficientLineItems,
                organisationId,
                prodRequest,
              });
            createdProductionOrder = await transactionalEntityManager.save(
              createdProductionOrder
            );
            if (possibleQuantity <= 0) {
              newProductionOrder = createdProductionOrder;
            }
          }
        }
		console.log(prodRequest)
        return null;
      }
    );
    return this.findOne(newProductionOrder.id);
  }

  async findAll() {
    const productionOrders = await this.productionOrdersRepository.find({
      relations: {
        bom: {
          finalGood: true,
          bomLineItems: true,
        },
        schedules: true,
        prodLineItems: {
          batchLineItem: {
            bin: true,
          },
          rawMaterial: true,
          purchaseRequisition: true,
        },
        prodRequest: true,
        organisation: true,
      },
    });

    for (const prodO of productionOrders) {
      let flag = true;
      if (prodO.status == ProductionOrderStatus.AWAITINGPROCUREMENT) {
        for (const prodLine of prodO.prodLineItems) {
          if (prodLine.sufficient == false) {
            flag = false;
            break;
          }
        }
        if (flag) {
          prodO.status = ProductionOrderStatus.READYTORELEASE;
          await this.productionOrdersRepository.save(prodO);
        }
      }
    }
    return this.productionOrdersRepository.find({
      relations: {
        bom: {
          finalGood: true,
          bomLineItems: true,
        },
        schedules: true,
        prodLineItems: {
          batchLineItem: {
            bin: true,
          },
          rawMaterial: true,
          purchaseRequisition: true,
        },
        prodRequest: true,
        organisation: true,
      },
      withDeleted: true,
    });
  }

  async findAllByOrgId(organisationId: number): Promise<ProductionOrder[]> {
    const productionOrders = await this.productionOrdersRepository.find({
      where: {
        organisationId,
      },
      relations: {
        bom: {
          finalGood: true,
          bomLineItems: true,
        },
        schedules: true,
        prodLineItems: {
          batchLineItem: {
            bin: true,
          },
          rawMaterial: true,
          purchaseRequisition: true,
        },
        prodRequest: {
			purchaseOrder: true,
		},
        organisation: true,
      },
    });
    for (const prodO of productionOrders) {
      let flag = true;
      if (prodO.status == ProductionOrderStatus.AWAITINGPROCUREMENT) {
        for (const prodLine of prodO.prodLineItems) {
          if (prodLine.sufficient == false) {
            flag = false;
            break;
          }
        }
        if (flag) {
          prodO.status = ProductionOrderStatus.READYTORELEASE;
          await this.productionOrdersRepository.save(prodO);
        }
      }
    }

    return await this.productionOrdersRepository.find({
      where: {
        organisationId,
      },
      relations: {
        bom: {
          finalGood: true,
          bomLineItems: true,
        },
        schedules: {
          completedGoods: {
            batchLineItems: true,
          },
		  productionLine: true,
        },
        prodLineItems: {
          batchLineItem: {
            bin: true,
          },
          rawMaterial: true,
          purchaseRequisition: true,
        },
        prodRequest: {
			purchaseOrder: true,
		},
        organisation: true,
      },
      withDeleted: true,
    });
  }

  async findOne(id: number): Promise<ProductionOrder> {
    try {
      const prodO = await this.productionOrdersRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          bom: {
            finalGood: true,
            bomLineItems: true,
          },
          schedules: true,
          prodLineItems: {
            batchLineItem: {
              bin: true,
            },
            rawMaterial: true,
            purchaseRequisition: true,
          },
          prodRequest: true,
          organisation: true,
        },
      });
      if (prodO.status == ProductionOrderStatus.AWAITINGPROCUREMENT) {
        let flag = true;
        for (const prodLine of prodO.prodLineItems) {
          if (prodLine.sufficient == false) {
            flag = false;
            break;
          }
        }
        if (flag) {
          prodO.status = ProductionOrderStatus.READYTORELEASE;
          await this.productionOrdersRepository.save(prodO);
        }
      }
      return await this.productionOrdersRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          bom: {
            finalGood: true,
            bomLineItems: {
              rawMaterial: true,
            },
          },
          schedules: true,
          prodLineItems: {
            batchLineItem: {
              bin: true,
            },
            rawMaterial: true,
            purchaseRequisition: true,
          },
          prodRequest: true,
          organisation: true,
        },
        withDeleted: true,
      });
    } catch (error) {
      throw new NotFoundException('Production Order not found');
    }
  }

  async update(
    id: number,
    updateProductionOrderDto: UpdateProductionOrderDto
  ): Promise<ProductionOrder> {
    const productionOrderToUpdate = await this.findOne(id);
    const arrayOfKeyValues = Object.entries(updateProductionOrderDto);
    arrayOfKeyValues.forEach(async ([key, value]) => {
      if (key == 'status') {
        if (value == ProductionOrderStatus.RELEASED) {
          await this.datasource.manager.transaction(
            async (transactionalEntityManager) => {
              let schedules: CreateScheduleDto[];
              let schedulesToBeAdded: Schedule[] = [];
              schedules =
                await this.productionLinesService.retrieveSchedulesForProductionOrder(
                  productionOrderToUpdate.plannedQuantity *
                    productionOrderToUpdate.bom.finalGood.lotQuantity,
                  productionOrderToUpdate.bom.finalGood.id,
                  productionOrderToUpdate.daily,
                  0,
                  productionOrderToUpdate.organisationId
                );
              for (const dto of schedules) {
                const { start, end, productionLineId } = dto;
                const schedule: Schedule = transactionalEntityManager.create(
                  Schedule,
                  {
                    start,
                    end,
                    productionLineId,
                    status: ScheduleType.PLANNED,
                    productionOrder: productionOrderToUpdate,
                    prodLineItems: [],
                  }
                );
                schedulesToBeAdded.push(
                  await transactionalEntityManager.save(schedule)
                );
                const bomToBeAdded = productionOrderToUpdate.bom;
                const prodLineItemsToBeAdded =
                  productionOrderToUpdate.prodLineItems;
                for (const bomLineItem of bomToBeAdded.bomLineItems) {
                  let current = 0;
                  let target = 0;
                  for (const schedule of schedulesToBeAdded) {
                    const prodLine = await this.productionLinesService.findOne(
                      schedule.productionLineId
                    );
                    const duration =
                      (schedule.end.getTime() - schedule.start.getTime()) /
                      3600000;
                    let start = target;
                    target +=
                      (prodLine.outputPerHour /
                        bomToBeAdded.finalGood.lotQuantity) *
                      duration *
                      bomLineItem.quantity;

                    for (const prodLineItem of prodLineItemsToBeAdded) {
                      if (
                        prodLineItem.rawMaterial.id ==
                        bomLineItem.rawMaterial.id
                      ) {
                        if (prodLineItem.quantity < target - current) {
                          current += prodLineItem.quantity;
                        } else {
                          current = target;
                        }
                        if (start < current) {
                          schedule.prodLineItems.push(prodLineItem);
                        }
                        if (current == target) {
                          break;
                        }
                      }
                    }
                  }
                }
                for (const schedule of schedulesToBeAdded) {
                  await transactionalEntityManager.save(schedule);
                }
                const startJob = new CronJob(schedule.start, async () => {
                  this.update(productionOrderToUpdate.id, {
                    status: ProductionOrderStatus.ONGOING,
                  });
                  this.schedulesService.update(schedule.id, {
                    status: ScheduleType.ONGOING,
                  });
                  this.logger.warn(
                    `time (${start}) for start job ${schedule.id} to run!`
                  );
                });
                const endJob = new CronJob(schedule.end, async () => {
                  this.schedulesService.update(schedule.id, {
                    status: ScheduleType.COMPLETED,
                  });
                  let checker = true;
                  let prodO: ProductionOrder = await this.findOne(
                    schedule.productionOrder.id
                  );
                  for (const sche of prodO.schedules) {
                    if (
                      !(sche.status == ScheduleType.COMPLETED) &&
                      !(sche.status == ScheduleType.ALLOCATED)
                    ) {
                      checker = false;
                    }
                  }
                  if (checker) {
                    await transactionalEntityManager.update(
                      ProductionOrder,
                      prodO.id,
                      { status: ProductionOrderStatus.COMPLETED }
                    );
                  }
                  this.logger.warn(
                    `time (${end}) for end job ${schedule.id} to run!`
                  );
                });
                this.schedulerRegistry.addCronJob(
                  `start ${schedule.id}`,
                  startJob
                );
                startJob.start();
                this.schedulerRegistry.addCronJob(`end ${schedule.id}`, endJob);
                endJob.start();
                let chron1 = await transactionalEntityManager.create(ChronJob, {
                  scheduledDate: schedule.start,
                  type: ChronType.SCHEDULESTART,
                  targetId: schedule.id,
                });
                let chron2 = await transactionalEntityManager.create(ChronJob, {
                  scheduledDate: schedule.end,
                  type: ChronType.SCHEDULEEND,
                  targetId: schedule.id,
                });
                await transactionalEntityManager.save(chron1);
                await transactionalEntityManager.save(chron2);
              }
              await transactionalEntityManager.update(ProductionOrder, id, {
                status: value,
              });
              return null;
            }
          );
        } else if (
          value == ProductionOrderStatus.ONGOING &&
          !productionOrderToUpdate.daily
        ) {
          await this.datasource.manager.transaction(
            async (transactionalEntityManager) => {
              for (const lineItem of productionOrderToUpdate.prodLineItems) {
                if (lineItem.quantity >= lineItem.batchLineItem.quantity) {
                  await transactionalEntityManager.softDelete(
                    BatchLineItem,
                    lineItem.batchLineItem.id
                  );
                } else {
                  await transactionalEntityManager.update(
                    BatchLineItem,
                    lineItem.batchLineItem.id,
                    {
                      reservedQuantity:
                        lineItem.batchLineItem.reservedQuantity -
                        lineItem.quantity,
                      quantity:
                        lineItem.batchLineItem.quantity - lineItem.quantity,
                    }
                  );
                }
                await transactionalEntityManager.save(lineItem);
              }
              await transactionalEntityManager.update(ProductionOrder, id, {
                status: value,
              });
              return null;
            }
          );
        } else if (
          value == ProductionOrderStatus.ONGOING &&
          productionOrderToUpdate.daily
        ) {
          await this.datasource.manager.transaction(
            async (transactionalEntityManager) => {
              const rawMaterialProdLineItems = new Map<
                number,
                ProductionLineItem[]
              >();

              for (const lineItem of productionOrderToUpdate.prodLineItems) {
                const rawMaterial = lineItem.rawMaterial;
                if (!rawMaterialProdLineItems.has(rawMaterial.id)) {
                  const lineItemsArr: ProductionLineItem[] = [];
                  lineItemsArr.push(lineItem);
                  rawMaterialProdLineItems.set(rawMaterial.id, lineItemsArr);
                } else {
                  const lineItemsArr = rawMaterialProdLineItems.get(
                    rawMaterial.id
                  );
                  lineItemsArr.push(lineItem);
                  rawMaterialProdLineItems.set(rawMaterial.id, lineItemsArr);
                }
              }

              for (const [
                id,
                lineItemsArr,
              ] of rawMaterialProdLineItems.entries()) {
                lineItemsArr.sort(
                  (lineItemOne, lineItemTwo) =>
                    lineItemOne.batchLineItem.expiryDate.getTime() -
                    lineItemTwo.batchLineItem.expiryDate.getTime()
                );
              }

              for (const lineItem of productionOrderToUpdate.bom.bomLineItems) {
                let quantityRequired =
                  productionOrderToUpdate.plannedQuantity * lineItem.quantity;
                let lineItemsArr = rawMaterialProdLineItems.get(
                  lineItem.rawMaterial.id
                );
                for (const lineItem of lineItemsArr) {
                  if (quantityRequired <= 0) {
                    break;
                  }
                  if (quantityRequired >= lineItem.quantity) {
                    quantityRequired -= lineItem.quantity;
                    if (lineItem.quantity >= lineItem.batchLineItem.quantity) {
                      await transactionalEntityManager.softDelete(
                        BatchLineItem,
                        lineItem.batchLineItem.id
                      );
                    } else {
                      await transactionalEntityManager.update(
                        BatchLineItem,
                        lineItem.batchLineItem.id,
                        {
                          reservedQuantity:
                            lineItem.batchLineItem.reservedQuantity -
                            lineItem.quantity,
                          quantity:
                            lineItem.batchLineItem.quantity - lineItem.quantity,
                        }
                      );
                    }
                    await transactionalEntityManager.save(lineItem);
                  } else {
                    if (quantityRequired >= lineItem.batchLineItem.quantity) {
                      await transactionalEntityManager.softDelete(
                        BatchLineItem,
                        lineItem.batchLineItem.id
                      );
                    } else {
                      await transactionalEntityManager.update(
                        BatchLineItem,
                        lineItem.batchLineItem.id,
                        {
                          reservedQuantity:
                            lineItem.batchLineItem.reservedQuantity -
                            quantityRequired,
                          quantity:
                            lineItem.batchLineItem.quantity - quantityRequired,
                        }
                      );
                    }
                    await transactionalEntityManager.save(lineItem);
                    quantityRequired = 0;
                  }
                }
              }

              await transactionalEntityManager.update(ProductionOrder, id, {
                status: value,
              });
              return null;
            }
          );
        } else {
          productionOrderToUpdate[key] = value;
          await this.productionOrdersRepository.save(productionOrderToUpdate);
        }
      } else {
        productionOrderToUpdate[key] = value;
        await this.productionOrdersRepository.save(productionOrderToUpdate);
      }
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<ProductionOrder> {
    const productionOrderToRemove =
      await this.productionOrdersRepository.findOneBy({ id });
    return this.productionOrdersRepository.remove(productionOrderToRemove);
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

  retrieveCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    console.log(jobs);
  }

  async retrieveBatchLineItemsForProduction() {
    const start = dayjs().startOf('day').toDate(); 
    const end = dayjs().endOf('day').toDate();

    const schedules = await this.datasource
      .getRepository(Schedule)
      .createQueryBuilder("schedule")
      .where("schedule.start BETWEEN :start AND :end", {start : start, end: end})
      .getMany();
    
    const map = new Map<number, number>;

    for (const schedule of schedules) {
      const fetchedSchedule = await this.schedulesService.findOne(schedule.id);
      for (const lineItem of fetchedSchedule.prodLineItems) {
        if (map.has(lineItem.batchLineItem.id)) {
          let qty = map.get(lineItem.batchLineItem.id);
          qty += lineItem.quantity;
          map.set(lineItem.batchLineItem.id, qty);
        } else {
          map.set(lineItem.batchLineItem.id, lineItem.quantity);
        }
      }
    }

    const lineItems = [];
    for (const [key, value] of map.entries()) {
      const batchLineItem = await this.batchLineItemsService.findOne(key);
      const productionBatchLine = new ProductionBatchLineDto();
      productionBatchLine.batchLineItem = batchLineItem;
      productionBatchLine.quantityToTake = value;
      lineItems.push(productionBatchLine);
    }

    return lineItems;
  }
}
