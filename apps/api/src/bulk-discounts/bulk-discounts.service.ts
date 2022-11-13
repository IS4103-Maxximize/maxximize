import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { BulkDiscountRangesService } from '../bulk-discount-ranges/bulk-discount-ranges.service';
import { ChronJobsService } from '../chron-jobs/chron-jobs.service';
import { ChronType } from '../chron-jobs/enums/chronType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateBulkDiscountDto } from './dto/create-bulk-discount.dto';
import { GetDiscountDto } from './dto/get-discount.dto';
import { UpdateBulkDiscountDto } from './dto/update-bulk-discount.dto';
import { BulkDiscount } from './entities/bulk-discount.entity';

@Injectable()
export class BulkDiscountsService {
  constructor(
    @InjectRepository(BulkDiscount)
    private readonly bulkDiscountsRepository: Repository<BulkDiscount>,
    private organisationService: OrganisationsService,
    private bulkDiscountRangesService: BulkDiscountRangesService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ChronJobsService))
    private chronJobService: ChronJobsService
  ) {}
  async create(createBulkDiscountDto: CreateBulkDiscountDto) {
    const {
      bulkType,
      bulkDiscountRangeDtos,
      organisationId,
      scheduleActivation,
    } = createBulkDiscountDto;
    const organisation = await this.organisationService.findOne(organisationId);
    const rangesToAdd = [];
    for (const dto of bulkDiscountRangeDtos) {
      const range = await this.bulkDiscountRangesService.create(dto);
      rangesToAdd.push(range);
    }
    const newBulkDiscount = this.bulkDiscountsRepository.create({
      bulkType,
      bulkDiscountRanges: rangesToAdd,
      organisation: organisation,
      created: new Date(),
      scheduleActivation: scheduleActivation
        ? new Date(scheduleActivation)
        : null,
    });
    const savedBulkDiscount = await this.bulkDiscountsRepository.save(
      newBulkDiscount
    );

    //need to set cron job if there is a schedule to activate
    if (scheduleActivation) {
      const dateToActivate = new Date(scheduleActivation);
      // const dateToActivate = new Date(new Date().getTime() + 7000)
      const job = new CronJob(dateToActivate, async () => {
        await this.update(savedBulkDiscount.id, {
          isActive: true,
          scheduleActivation: null,
        });
      });
      this.schedulerRegistry.addCronJob(
        `${savedBulkDiscount.id}-activateBulkDiscount`,
        job
      );
      job.start();
      //add chron job to database
      await this.chronJobService.create({
        scheduledDate: dateToActivate,
        type: ChronType.BULKDISCOUNT,
        targetId: savedBulkDiscount.id,
      });
    }

    return this.findOne(savedBulkDiscount.id);
  }

  findAll() {
    return this.bulkDiscountsRepository.find({
      relations: {
        bulkDiscountRanges: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.bulkDiscountsRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          bulkDiscountRanges: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `bulk discount with this id: ${id} cannot be found!`
      );
    }
  }

  async findActiveBulkDiscount(orgId: number) {
    const bulkDiscountsAvailable = await this.findAllByOrg(orgId);
    const active = bulkDiscountsAvailable.find((discount) => discount.isActive);
    let sortedRanges: any;
    if (active) {
      sortedRanges = active.bulkDiscountRanges.sort((a, b) => {
        if (a.start > b.start) {
          return 1;
        } else {
          return -1;
        }
      });
      active.bulkDiscountRanges = sortedRanges;
    }
    return active;
  }

  async getDiscount(getDiscountDto: GetDiscountDto) {
    const { organisationId, totalPrice, totalWeight } = getDiscountDto;
    const activeBulkDiscount = await this.findActiveBulkDiscount(
      organisationId
    );
    if (activeBulkDiscount) {
      const ranges = activeBulkDiscount.bulkDiscountRanges;
      const selectedRange = ranges.find((range) => {
        const type = activeBulkDiscount.bulkType;
        const quantity = type === 'weight' ? totalWeight : totalPrice;
        if (range.start && range.end) {
          return quantity >= range.start && quantity <= range.end;
        }
        if (range.start && !range.end) {
          return quantity >= range.start;
        }
      });
      if (selectedRange) {
        const discountRate = selectedRange.discountRate;
        // const discount = Math.round((discountRate / 100) * totalPrice)
        return discountRate;
      }
    }
    return 0;
  }

  async findAllByOrg(orgId: number) {
    return this.bulkDiscountsRepository.find({
      where: {
        organisationId: orgId,
      },
      relations: {
        bulkDiscountRanges: true,
      },
    });
  }

  async update(id: number, updateBulkDiscountDto: UpdateBulkDiscountDto) {
    const bulkDiscount = await this.findOne(id);
    const keyValues = Object.entries(updateBulkDiscountDto);
    for (const [key, value] of keyValues) {
      if (key === 'isActive' && value) {
        //need to set currently active one to inactive
        const allBulkDiscounts = await this.findAllByOrg(
          bulkDiscount.organisationId
        );
        const activeBulkDiscount = allBulkDiscounts.find(
          (discount) => discount.isActive
        );
        if (activeBulkDiscount) {
          await this.update(activeBulkDiscount.id, { isActive: false });
        }
      }
      bulkDiscount[key] = value;
    }
    return this.bulkDiscountsRepository.save(bulkDiscount);
  }

  async remove(id: number) {
    const bulkDiscountToRemove = await this.findOne(id);
    if (bulkDiscountToRemove.isActive) {
      throw new BadRequestException('bulk discount is still ongoing!');
    }
    return this.bulkDiscountsRepository.remove(bulkDiscountToRemove);
  }
}
