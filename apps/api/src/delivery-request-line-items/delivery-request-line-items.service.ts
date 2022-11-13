import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateDeliveryRequestLineItemDto } from './dto/create-delivery-request-line-item.dto';
import { DeliveryRequestLineItem } from './entities/delivery-request-line-item.entity';

@Injectable()
export class DeliveryRequestLineItemsService {
  constructor(@InjectRepository(DeliveryRequestLineItem)
  private readonly deliveryRequestLineItemRepository: Repository<DeliveryRequestLineItem>,
  private dataSource: DataSource
  ){}

  async create(createDeliveryRequestLineItemDto: CreateDeliveryRequestLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const deliveryRequestLineItem = new DeliveryRequestLineItem();
      deliveryRequestLineItem.product = createDeliveryRequestLineItemDto.product;
      deliveryRequestLineItem.quantity = createDeliveryRequestLineItemDto.quantity;
      const deliveryRequestLine = await queryRunner.manager.save(deliveryRequestLineItem);
      queryRunner.commitTransaction()
      return deliveryRequestLine;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.deliveryRequestLineItemRepository.find({
      relations: ["deliveryRequest", "product"]
    });
  }

  async findOne(id: number) {
    return await this.deliveryRequestLineItemRepository.findOne({
      where: {
        id: id
      },
      relations: ["deliveryRequest", "product"]
    });
  }

  async findAllByOrgId(orgId: number) {
    return await this.deliveryRequestLineItemRepository.findOne({
      where: {
        deliveryRequest: {
          purchaseOrder: {
            currentOrganisationId: orgId
          }
        }
      },
      relations: ["deliveryRequest", "product"]
    });
  }

  async remove(id: number) {
    return await this.deliveryRequestLineItemRepository.softDelete(id);
  }
}
