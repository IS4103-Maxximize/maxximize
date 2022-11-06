import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBulkDiscountRangeDto } from './dto/create-bulk-discount-range.dto';
import { UpdateBulkDiscountRangeDto } from './dto/update-bulk-discount-range.dto';
import { BulkDiscountRange } from './entities/bulk-discount-range.entity';

@Injectable()
export class BulkDiscountRangesService {
  constructor(
    @InjectRepository(BulkDiscountRange)
    private readonly bulkDiscountRangesRepository: Repository<BulkDiscountRange>
  ) {}
  create(createBulkDiscountRangeDto: CreateBulkDiscountRangeDto) {
    const {start, end, discountRate} = createBulkDiscountRangeDto
    const newRange = this.bulkDiscountRangesRepository.create({
      start,
      end,
      discountRate
    })
    return this.bulkDiscountRangesRepository.save(newRange)
  }

  findAll() {
    return this.bulkDiscountRangesRepository.find()
  }

  async findOne(id: number) {
    try {
      return await this.bulkDiscountRangesRepository.findOneOrFail({
        where: {
          id
        }, relations: {
          bulkDiscount: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`bulk discount range with this id: ${id} cannot be found!`)
    }
  }

  async findAllByBulkDiscount(bdId: number) {
    return this.bulkDiscountRangesRepository.find({
      where: {
        bulkDiscountId: bdId
      }
    })
  }

  async update(id: number, updateBulkDiscountRangeDto: UpdateBulkDiscountRangeDto) {
    const range = await this.findOne(id)
    const keyValues = Object.entries(updateBulkDiscountRangeDto)
    for (const [key, value] of keyValues) {
      range[key] = value
    }
    return this.bulkDiscountRangesRepository.save(range)
  }

  async remove(id: number) {
    const bulkDiscountRangeToRemove = await this.findOne(id)
    return this.bulkDiscountRangesRepository.remove(bulkDiscountRangeToRemove)
  }
}
