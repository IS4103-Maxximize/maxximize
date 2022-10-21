import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { DeliveryRequestLineItem } from '../delivery-request-line-items/entities/delivery-request-line-item.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { Role } from '../users/enums/role.enum';
import { VehicleStatus } from '../vehicles/enums/vehicleStatus.enum';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
import { UpdateDeliveryRequestDto } from './dto/update-delivery-request.dto';
import { DeliveryRequest } from './entities/delivery-request.entity';
import { DeliveryRequestStatus } from './enums/deliveryRequestStatus.enum';

@Injectable()
export class DeliveryRequestsService {
  constructor(@InjectRepository(DeliveryRequest)
  private readonly deliveryRequestRepository: Repository<DeliveryRequest>,
  private purchaseOrderService: PurchaseOrdersService,
  private organisationService: OrganisationsService,
  private vehicleService: VehiclesService,
  private batchLineItemService: BatchLineItemsService,
  private dataSource: DataSource
  ) {}

  async create(createDeliveryRequestDto: CreateDeliveryRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deliveryRequest = new DeliveryRequest();
      deliveryRequest.addressFrom = createDeliveryRequestDto.addressFrom;
      deliveryRequest.dateCreated = new Date();
      deliveryRequest.status = DeliveryRequestStatus.READYTODELIVER;

      const purchaseOrder = await this.purchaseOrderService.findOne(createDeliveryRequestDto.purchaseOrderId);
      deliveryRequest.purchaseOrder = purchaseOrder;
      deliveryRequest.addressTo = purchaseOrder.deliveryAddress;

      const organisationId = createDeliveryRequestDto.organisationId;

      await this.allocateDriverToRequest(organisationId, deliveryRequest);
      await this.allocateVehicleToRequest(organisationId, deliveryRequest);

      const finalGoodsStock = await this.batchLineItemService.getAggregatedFinalGoods(organisationId);
      const deliveryLineItems = [];

      for (const purchaseLineItem of purchaseOrder.poLineItems) {
        const productId = purchaseLineItem.finalGood.id;
        const totalQty = finalGoodsStock.get(productId).reduce((seed, lineItem) => {
          return seed + (lineItem.quantity - lineItem.reservedQuantity);
        }, 0);
        if (totalQty > purchaseLineItem.quantity) {
          let qty = purchaseLineItem.quantity - purchaseLineItem.fufilledQty;
          const batchLineItems = finalGoodsStock.get(productId);
          batchLineItems.sort(
            (lineItemOne, lineItemTwo) =>
              lineItemOne.expiryDate.getTime() - lineItemTwo.expiryDate.getTime()
          );
          for (const batchLineItem of batchLineItems) {
            if ((batchLineItem.quantity - batchLineItem.reservedQuantity) > qty) {
              purchaseLineItem.fufilledQty += qty;
              batchLineItem.reservedQuantity += qty;
              qty = 0;
            } else {
              batchLineItem.reservedQuantity = batchLineItem.quantity;
              purchaseLineItem.fufilledQty += (batchLineItem.quantity - batchLineItem.reservedQuantity);
              qty -= (batchLineItem.quantity - batchLineItem.reservedQuantity);
            }
            await queryRunner.manager.save(batchLineItem);
            await queryRunner.manager.save(purchaseLineItem);
            if (qty <= 0) {
              break;
            }
          }
          const deliveryRequestLineItem = new DeliveryRequestLineItem();
          deliveryRequestLineItem.quantity = purchaseLineItem.quantity;
          deliveryRequestLineItem.product = purchaseLineItem.finalGood;
          deliveryLineItems.push(deliveryRequestLineItem);
          purchaseLineItem.fufilledQty = purchaseLineItem.quantity;
          await queryRunner.manager.save(purchaseLineItem);
        } else {
          const deliveryRequestLineItem = new DeliveryRequestLineItem();
          deliveryRequestLineItem.quantity = totalQty;
          deliveryRequestLineItem.product = purchaseLineItem.finalGood;
          deliveryLineItems.push(deliveryRequestLineItem);
          for (const batchLineItem of finalGoodsStock.get(productId)) {
            batchLineItem.reservedQuantity = batchLineItem.quantity;
            purchaseLineItem.fufilledQty += batchLineItem.quantity;
            await queryRunner.manager.save(batchLineItem);
            await queryRunner.manager.save(purchaseLineItem);
          }
        }
      }

      deliveryRequest.deliveryRequestLineItems = deliveryLineItems;

      const deliveryReq = await queryRunner.manager.save(deliveryRequest);
      await queryRunner.commitTransaction();
      return deliveryReq;

    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async allocateDriverToRequest(orgId: number, deliveryRequest: DeliveryRequest) {
    const workers = await this.organisationService.findOrganisationWorkers(orgId);
    const drivers = workers.filter((worker) => {
      return worker.role = Role.DRIVER;
    });
    let flag = false;
    for (const driver of drivers) {
      if (driver.available) {
        deliveryRequest.user = driver;
        flag = true;
        break;
      }
    }
    if (!flag) {
      throw new InternalServerErrorException("No drivers are available");
    } else {
      return deliveryRequest;
    }
  }

  async allocateVehicleToRequest(orgId: number, deliveryRequest: DeliveryRequest) {
    const vehicles = await this.vehicleService.findAllByOrg(orgId);
    let flag = false;
    for (const vehicle of vehicles) {
      if (vehicle.currentStatus === VehicleStatus.AVAILABLE) {
        deliveryRequest.vehicle = vehicle;
        flag = true;
        break
      }
    }
    if (!flag) {
      throw new InternalServerErrorException("No vehicles are available");
    } else {
      return deliveryRequest;
    }
  }

  // Partial fufillment
  async createDeliveryRequestProdReq(createDeliveryRequestDto: CreateDeliveryRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let deliveryRequest = new DeliveryRequest();
      deliveryRequest.addressFrom = createDeliveryRequestDto.addressFrom;
      deliveryRequest.dateCreated = new Date();
      deliveryRequest.status = DeliveryRequestStatus.CREATED;

      const purchaseOrder = await this.purchaseOrderService.findOne(createDeliveryRequestDto.purchaseOrderId);
      deliveryRequest.purchaseOrder = purchaseOrder;
      deliveryRequest.addressTo = purchaseOrder.deliveryAddress;

      const organisationId = createDeliveryRequestDto.organisationId;

      deliveryRequest = await this.allocateDriverToRequest(organisationId, deliveryRequest);
      deliveryRequest = await this.allocateVehicleToRequest(organisationId, deliveryRequest);

      const deliveryLineItems = [];

      for (const batchLineItem of purchaseOrder.batchLineItems) {
        const deliveryRequestLineItem = new DeliveryRequestLineItem();
        deliveryRequestLineItem.quantity = batchLineItem.quantity;
        deliveryRequestLineItem.product = batchLineItem.product;
        deliveryLineItems.push(deliveryRequestLineItem);
      }

      deliveryRequest.deliveryRequestLineItems = deliveryLineItems;
      
      const deliveryReq = await queryRunner.manager.save(deliveryRequest);
      await queryRunner.commitTransaction();
      return deliveryReq;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.deliveryRequestRepository.find({
      relations: ["vehicles", "purchaseOrder", "users", "deliveryRequestLineItems"]
    });
  }

  async findOne(id: number) {
    return await this.deliveryRequestRepository.findOne({
      where: {
        id: id
      },
      relations: ["vehicles", "purchaseOrder", "users", "deliveryRequestLineItems"]
    });
  }

  async findAllByOrganisationId(orgId: number) {
    return await this.deliveryRequestRepository.find({
      where: {
        purchaseOrder: {
          organisationId: orgId
        }
      },
      relations: ["vehicles", "purchaseOrder", "users", "deliveryRequestLineItems"]
    });
  } 

  async findAllByWorkerId(workerId: number) {
    return await this.deliveryRequestRepository.find({
      where: {
        user: {
          id: workerId
        }
      },
      relations: ["vehicles", "purchaseOrder", "users", "deliveryRequestLineItems"]
    });
  }

  async update(id: number, updateDeliveryRequestDto: UpdateDeliveryRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(DeliveryRequest, id, updateDeliveryRequestDto);
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    return await this.deliveryRequestRepository.softDelete(id);
  }
}
