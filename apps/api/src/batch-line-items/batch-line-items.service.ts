import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BinsService } from '../bins/bins.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateBatchLineItemDto } from './dto/create-batch-line-item.dto';
import { UpdateBatchLineItemDto } from './dto/update-batch-line-item.dto';
import { BatchLineItem } from './entities/batch-line-item.entity';

@Injectable()
export class BatchLineItemsService {
  constructor(
    @InjectRepository(BatchLineItem)
    private readonly batchLineItemRepository: Repository<BatchLineItem>,
    private binService: BinsService,
    private rawMaterialService: RawMaterialsService,
    private dataSource: DataSource
  ) {}

  async create(createBatchLineItemDto: CreateBatchLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batchLineItem = new BatchLineItem();
      const bin = await this.binService.findOne(createBatchLineItemDto.binId);
      const rawMaterial = await this.rawMaterialService.findOne(createBatchLineItemDto.productId);
      batchLineItem.bin = bin;
      batchLineItem.product = rawMaterial;
      batchLineItem.quantity = createBatchLineItemDto.quantity;
      batchLineItem.subTotal = createBatchLineItemDto.subtotal;
      return queryRunner.manager.save(batchLineItem);
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }


  }

  findAll() {
    return this.batchLineItemRepository.find({
      relations: ["product"]
    })
  }

  findOne(id: number) {
    try {
      return this.batchLineItemRepository.findOneOrFail({
        where: {
          id: id
        },
        relations: ["product"]
      });
    } catch (err) {
      throw new NotFoundException(`Batch line items with id: ${id} cannot be found`);
    }
  }

  /*
  update(id: number, updateBatchLineItemDto: UpdateBatchLineItemDto) {
    return `This action updates a #${id} batchLineItem`;
  }
  */

  remove(id: number) {
    return this.batchLineItemRepository.delete(id);
  }
}
