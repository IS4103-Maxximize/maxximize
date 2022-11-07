import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { BulkDiscountsService } from '../bulk-discounts/bulk-discounts.service';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';
import { ProductionOrderStatus } from '../production-orders/enums/production-order-status.enum';
import { ProductionOrdersService } from '../production-orders/production-orders.service';
import { SalesInquiryStatus } from '../sales-inquiry/enums/salesInquiryStatus.enum';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { ScheduleType } from '../schedules/enums/scheduleType.enum';
import { SchedulesService } from '../schedules/schedules.service';
import { CreateChronJobDto } from './dto/create-chron-job.dto';
import { UpdateChronJobDto } from './dto/update-chron-job.dto';
import { ChronJob } from './entities/chron-job.entity';

@Injectable()
export class ChronJobsService implements OnModuleInit {
  private readonly logger = new Logger(ChronJobsService.name);
  constructor(
    @InjectRepository(ChronJob)
    private readonly chronJobRepository: Repository<ChronJob>,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => SalesInquiryService))
    private salesInquiryService: SalesInquiryService,
    @Inject(forwardRef(() => SchedulesService))
    private schedulesService: SchedulesService,
    @Inject(forwardRef(() => ProductionOrdersService))
    private productionOrdersService: ProductionOrdersService,
    @Inject(forwardRef(() => BulkDiscountsService))
    private bulkDiscountService: BulkDiscountsService
  ) {}
  create(createChronJobDto: CreateChronJobDto) {
    const { scheduledDate, type, targetId } = createChronJobDto;
    const newChronJob = this.chronJobRepository.create({
      scheduledDate,
      type,
      targetId,
    });
    return this.chronJobRepository.save(newChronJob);
  }

  findAll() {
    return this.chronJobRepository.find();
  }

  findOne(id: number) {
    return this.chronJobRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const chronToRemove = await this.findOne(id);
    return this.chronJobRepository.remove(chronToRemove);
  }

  async onModuleInit() {
    await this.recreateSavedCronJobs();
  }

  async recreateSavedCronJobs() {
    const savedCronJobs = await this.findAll();
    for (const job of savedCronJobs) {
      const { scheduledDate, type, targetId } = job;
      if (new Date().getTime() > scheduledDate.getTime()) {
        await this.remove(job.id);
      } else {
        switch (type) {
          case 'salesInquiry':
            const si = await this.salesInquiryService.findOne(targetId);
            const job = new CronJob(scheduledDate, async () => {
              //update SI status to expired
              if (si.status === SalesInquiryStatus.SENT) {
                await this.salesInquiryService.update(si.id, {
                  status: SalesInquiryStatus.EXPIRED,
                });
              }
            });

            this.schedulerRegistry.addCronJob(
              `${si.id}-updateSiToExpired`,
              job
            );
            job.start();
            break;
          case 'scheduleStart':
            //create chron job for schedule start
            let schedule = await this.schedulesService.findOne(targetId);
            let prodO = await this.productionOrdersService.findOne(
              schedule.productionOrder.id
            );
            const startJob = new CronJob(scheduledDate, async () => {
              this.productionOrdersService.update(prodO.id, {
                status: ProductionOrderStatus.ONGOING,
              });
              this.schedulesService.update(schedule.id, {
                status: ScheduleType.ONGOING,
              });
              this.logger.warn(
                `time (${schedule.start}) for start job ${schedule.id} to run!`
              );
            });
            this.schedulerRegistry.addCronJob(`start ${schedule.id}`, startJob);
            startJob.start();
            break;
          case 'scheduleEnd':
            //create chron job for schedule end
            let schedule1 = await this.schedulesService.findOne(targetId);
            let prodO1 = await this.productionOrdersService.findOne(
              schedule1.productionOrder.id
            );
            const endJob = new CronJob(schedule1.end, async () => {
              await this.schedulesService.update(schedule1.id, {
                status: ScheduleType.COMPLETED,
              });
              let checker = true;
              let prodOrder: ProductionOrder =
                await this.productionOrdersService.findOne(
                  schedule1.productionOrder.id
                );
              for (const sche of prodOrder.schedules) {
                if (
                  !(sche.status == ScheduleType.COMPLETED) &&
                  !(sche.status == ScheduleType.ALLOCATED)
                ) {
                  checker = false;
                }
              }
              if (checker) {
                await this.productionOrdersService.update(prodOrder.id, {
                  status: ProductionOrderStatus.COMPLETED,
                });
              }

              this.logger.warn(
                `time (${schedule1.end}) for end job ${schedule1.id} to run!`
              );
            });
            this.schedulerRegistry.addCronJob(`end ${schedule1.id}`, endJob);
            endJob.start();
            break;
          case 'bulkDiscount':
            const bulkDiscount = await this.bulkDiscountService.findOne(targetId)
            const bulkDiscountJob = new CronJob(scheduledDate, async() => {
              await this.bulkDiscountService.update(bulkDiscount.id, {isActive: true, scheduleActivation: null})
            })
            this.schedulerRegistry.addCronJob(`${bulkDiscount.id}-activateBulkDiscount`, bulkDiscountJob);
            bulkDiscountJob.start()
            break;
        }
      }
    }
  }
}
