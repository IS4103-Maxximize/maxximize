import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';

@Injectable()
export class BatchesService {
  constructor(@InjectRepository(Batch)
  private readonly batchRepository: Repository<Batch>) {}

  create(createBatchDto: CreateBatchDto) {
    const batch = new Batch();
    batch.batchNumber = createBatchDto.batchNumber;
    batch.batchLineItems = createBatchDto.batchLineItems;
    return this.batchRepository.save(batch);
  }

  async findAll() {
    const batches = await this.batchRepository.find();
    if (batches.length == 0 || batches === undefined) {
      throw new NotFoundException("No batches found");
    }
    return batches;
  }

  async findOne(id: number) {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ["batchLineItems", "goodReceipt"]
    });
    if (batch) {
      throw new NotFoundException(`No batch with id: ${ id } found`);
    }
    return batch;
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    const batch = await this.findOne(id);
    batch.goodReceipt = updateBatchDto.goodReceipt;
    batch.batchLineItems = updateBatchDto.batchLineItems;
    return this.batchRepository.save(batch);
  }

  remove(id: number) {
    return this.batchRepository.delete(id);
  }
}
