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
    batch.organisationId = createBatchDto.organisationId;
    
    const warehouses = await this.warehouseService.findAll();
    const batchLineItems = [];
    let bins : Bin[];
    bins = [];
    for (const warehouse of warehouses) {
      bins = [...bins, ...warehouse.bins];
    }
    
    // Duplicate goodReceiptLineItems
    const unassigned = goodReceiptLineItems.slice();

    // Try to allocate those line items fully
    for (const lineItem of goodReceiptLineItems) {
      for (const bin of bins) {
        const lineItemCapacity = lineItem.product.lotQuantity * lineItem.quantity;
        if (lineItemCapacity <= bin.capacity - bin.currentCapacity) {
          const batchLineItem = new BatchLineItem();
          batchLineItem.bin = bin;
          batchLineItem.product = lineItem.product;
          batchLineItem.quantity = lineItem.quantity;
          batchLineItem.subTotal = lineItem.product.unitPrice * lineItem.quantity;
          batchLineItems.push(batchLineItem);

          bin.currentCapacity = bin.currentCapacity + lineItemCapacity;
          
          const index = unassigned.indexOf(lineItem);
          unassigned.splice(index, 1);
          break;
        }
      }
    }

    // For those that cannot be allocated fully, find bins with space
    // and allocate partially till all of the product is allocated
    for (const unallocated of unassigned) {
      let qty = unallocated.quantity * unallocated.product.lotQuantity;
      while (qty > 0) {
        for (const bin of bins) {
          const availableSpace = bin.capacity - bin.currentCapacity;
          if (availableSpace > 0) {
            const batchLineItem = new BatchLineItem();
            if (qty > availableSpace) {
              batchLineItem.quantity =  availableSpace / unallocated.product.lotQuantity;
              bin.currentCapacity = bin.capacity;
            } else {
              batchLineItem.quantity =  qty / unallocated.product.lotQuantity;
              bin.currentCapacity = bin.currentCapacity + qty;
            }
            batchLineItem.bin = bin;
            batchLineItem.product = unallocated.product;
            batchLineItem.subTotal = unallocated.product.unitPrice * batchLineItem.quantity;
            
            batchLineItems.push(batchLineItem);

            qty -= availableSpace;
          }
          if (qty < 0) {
            break;
          }
        }
      }
    }

    for (const bin of bins) {
      const updateBinDto = new UpdateBinDto();
      updateBinDto.currentCapacity = bin.currentCapacity;
      await this.binService.update(bin.id, updateBinDto);
    }

    batch.batchLineItems = batchLineItems;

    const createdBatch = await queryRunner.manager.save(batch);
    return createdBatch;
  }

  async findAll() {
    return await this.batchRepository.find({
      relations: ["batchLineItems", "goodReceipt"]
    });
  }

  async findOne(id: number) {
    return await this.batchRepository.findOne({
      where: { id },
      relations: ["batchLineItems", "goodReceipt"]
    });
  }

  async findAllByOrganisationId(id: number) {
    return await this.batchRepository.find({
      where: {
        organisationId: id
      },
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
