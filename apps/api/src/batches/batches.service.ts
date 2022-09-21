import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BinsService } from '../bins/bins.service';
import { UpdateBinDto } from '../bins/dto/update-bin.dto';
import { Bin } from '../bins/entities/bin.entity';
import { GrLineItem } from '../gr-line-items/entities/gr-line-item.entity';
import { WarehousesService } from '../warehouses/warehouses.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';

@Injectable()
export class BatchesService {
  constructor(@InjectRepository(Batch)
  private readonly batchRepository: Repository<Batch>,
  private warehouseService: WarehousesService,
  private binService: BinsService,
  private dataSource: DataSource) {}

  async create(createBatchDto: CreateBatchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batch = new Batch();
      batch.batchNumber = createBatchDto.batchNumber;
      batch.batchLineItems = createBatchDto.batchLineItems;
      const createdBatch = await queryRunner.manager.save(batch);
      await queryRunner.commitTransaction();
      return createdBatch;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createWithExistingTransaction(createBatchDto: CreateBatchDto, goodReceiptLineItems: GrLineItem[], queryRunner: QueryRunner) {
    const batch = new Batch();
    batch.batchNumber = createBatchDto.batchNumber;
    /*
    const warehouses = await this.warehouseService.findAll();
    const batchLineItems = [];
    let bins : Bin[];
    bins = [];
    for (const warehouse of warehouses) {
      bins = [...bins, ...warehouse.bins];
    }
    const allocated: GrLineItem[] = [];

    // Try to allocate those line items fully
    for (const lineItem of goodReceiptLineItems) {
      for (const bin of bins) {
        const lineItemCapacity = lineItem.product.lotQuantity * lineItem.quantity;
        if (lineItemCapacity < bin.capacity - bin.currentCapacity) {
          const batchLineItem = new BatchLineItem();
          batchLineItem.bin = bin;
          batchLineItem.product = lineItem.product;
          batchLineItem.quantity = lineItem.quantity;
          batchLineItems.push(batchLineItem);

          const updateBinDto = new UpdateBinDto();
          updateBinDto.capacity = bin.currentCapacity + lineItemCapacity;
          await this.binService.update(bin.id, updateBinDto);

          allocated.push(lineItem);
          break;
        }
      }
    }
    const unassignedGrLineItems = [...goodReceiptLineItems, ...allocated];
    console.log(unassignedGrLineItems);

    for (const unallocated of unassignedGrLineItems) {
      let qty = unallocated.quantity * unallocated.product.lotQuantity;
      while (qty > 0) {
        for (const bin of bins) {
          const batchLineItem = new BatchLineItem();
          qty -= bin.capacity - bin.currentCapacity; //what if qty is 10 but u got 20 in bin
          batchLineItem.bin = bin;
          batchLineItem.product = unallocated.product;
          batchLineItem.quantity = (bin.capacity - bin.currentCapacity) / unallocated.product.lotQuantity;
          batchLineItems.push(batchLineItem);
          
          const updateBinDto = new UpdateBinDto();
          updateBinDto.capacity = bin.currentCapacity + qty;
          await this.binService.update(bin.id, updateBinDto);

          if (qty < 0) {
            break;
          }
        }
      }
    }

    batch.batchLineItems = batchLineItems;
    */

    const createdBatch = await queryRunner.manager.save(batch);
    return createdBatch;
  }

  async findAll() {
    return await this.batchRepository.find();
  }

  async findOne(id: number) {
    return await this.batchRepository.findOne({
      where: { id },
      relations: ["batchLineItems", "goodReceipt"]
    });
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const batch = await this.findOne(id);
      batch.goodReceipt = updateBatchDto.goodReceipt;
      batch.batchLineItems = updateBatchDto.batchLineItems;
      await queryRunner.manager.update(Batch, id, updateBatchDto);
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.batchRepository.delete(id);
  }
}
