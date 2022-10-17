import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { SalesInquiryStatus } from '../sales-inquiry/enums/salesInquiryStatus.enum';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { CreateChronJobDto } from './dto/create-chron-job.dto';
import { UpdateChronJobDto } from './dto/update-chron-job.dto';
import { ChronJob } from './entities/chron-job.entity';

@Injectable()
export class ChronJobsService implements OnModuleInit {
  constructor(
    @InjectRepository(ChronJob)
    private readonly chronJobRepository: Repository<ChronJob>,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => SalesInquiryService))
    private salesInquiryService: SalesInquiryService
  ) {}
  create(createChronJobDto: CreateChronJobDto) {
    const {scheduledDate, type, targetId} = createChronJobDto
    const newChronJob = this.chronJobRepository.create({
      scheduledDate,
      type,
      targetId
    })
    return this.chronJobRepository.save(newChronJob)
  }

  findAll() {
    return this.chronJobRepository.find()
  }

  findOne(id: number) {
    return this.chronJobRepository.findOne({
      where: {
        id
      }
    })
  }

  async remove(id: number) {
    const chronToRemove = await this.findOne(id)
    return this.chronJobRepository.remove(chronToRemove)
  }

  async onModuleInit() {
      await this.recreateSavedCronJobs()
  }

  async recreateSavedCronJobs() {
    const savedCronJobs = await this.findAll()
    for (const job of savedCronJobs) {
      const {scheduledDate, type, targetId} = job
      if (new Date().getTime() > scheduledDate.getTime()) {
        await this.remove(job.id)
      } else {
        switch(type) {
          case "salesInquiry":
            const si = await this.salesInquiryService.findOne(targetId)
            const job = new CronJob(scheduledDate, async() => {
              //update SI status to expired
              if (si.status === SalesInquiryStatus.SENT) {
                await this.salesInquiryService.update(si.id, {status: SalesInquiryStatus.EXPIRED})
              }
            });
          
            this.schedulerRegistry.addCronJob(`${si.id}-updateSiToExpired`, job);
            job.start();
          break
          case "scheduleStart":
            //create chron job for schedule start
          break
          case "scheduleEnd":
            //create chron job for schedule end
          break 
        }
      }
    }
  }
}
