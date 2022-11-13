import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { CreateReservationLineItemDto } from './dto/create-reservation-line-item.dto';
import { UpdateReservationLineItemDto } from './dto/update-reservation-line-item.dto';
import { ReservationLineItem } from './entities/reservation-line-item.entity';

@Injectable()
export class ReservationLineItemsService {
  constructor(@InjectRepository(ReservationLineItem)
  private readonly reservationLineItemsRepository: Repository<ReservationLineItem>,
  private batchLineItemService: BatchLineItemsService,
  private dataSource: DataSource) {}

  async create(createReservationLineItemDto: CreateReservationLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservationLineItem = new ReservationLineItem();
      reservationLineItem.quantity = createReservationLineItemDto.quantity;
      reservationLineItem.batchLineItem = await this.batchLineItemService.findOne(createReservationLineItemDto.batchLineItemId);
      const reservationLine = await queryRunner.manager.save(reservationLineItem);
      queryRunner.commitTransaction();
      return reservationLine;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.reservationLineItemsRepository.find({
      relations: ["batchLineItem", "purchaseOrder"]
    })
  }

  findOne(id: number) {
    return this.reservationLineItemsRepository.findOne({
      where: {
        id: id
      },
      relations: ["batchLineItem", "purchaseOrder"]
    })
  }

  async update(id: number, updateReservationLineItemDto: UpdateReservationLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(ReservationLineItem, id, updateReservationLineItemDto);
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.reservationLineItemsRepository.softDelete(id);
  }
}
