/* eslint-disable prefer-const */
import { HttpService } from '@nestjs/axios';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { catchError, map } from 'rxjs';
import { DataSource, Not, Repository } from 'typeorm';
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { InvoiceStatus } from '../invoices/enums/invoiceStatus.enum';
import { InvoicesService } from '../invoices/invoices.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { CreateFinalGoodDto } from './dto/create-final-good.dto';
import { UpdateFinalGoodDto } from './dto/update-final-good.dto';
import { FinalGood } from './entities/final-good.entity';

@Injectable()
export class FinalGoodsService {
  constructor(
    @InjectRepository(FinalGood)
    private readonly finalGoodRepository: Repository<FinalGood>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @Inject(forwardRef(() => InvoicesService))
    private invoicesService: InvoicesService,
    private readonly httpService: HttpService,
    private billOfMaterialService: BillOfMaterialsService,
    private batchLineItemService: BatchLineItemsService,
    private dataSource: DataSource
  ) {}

  async create(createFinalGoodDto: CreateFinalGoodDto): Promise<FinalGood> {
    try {
      const {
        name,
        description,
        unit,
        unitPrice,
        expiry,
        lotQuantity,
        organisationId,
        // image
      } = createFinalGoodDto;
      let organisationToBeAdded: Organisation;
      organisationToBeAdded =
        await this.organisationsRepository.findOneByOrFail({
          id: organisationId,
        });
      const newFinalGoodInstance = this.finalGoodRepository.create({
        name,
        description,
        unit,
        unitPrice,
        expiry,
        lotQuantity,
        // image,
        organisation: organisationToBeAdded,
      });
      const newFinalGood = await this.finalGoodRepository.save(
        newFinalGoodInstance
      );
      const skuCode = `${newFinalGood.id}-${name
        .toUpperCase()
        .substring(0, 3)}`;
      return this.update(newFinalGood.id, { skuCode: skuCode });
    } catch (err) {
      throw new NotFoundException('The organisation cannot be found');
    }
  }

  findAll(): Promise<FinalGood[]> {
    return this.finalGoodRepository.find({
      relations: {
        organisation: true,
        billOfMaterial: true,
      },
    });
  }

  async findAllByOrg(organisationId: number): Promise<FinalGood[]> {
    return this.finalGoodRepository.find({
      where: {
        organisation: {
          id: organisationId,
        },
      },
      relations: {
        organisation: true,
        billOfMaterial: true,
      },
    });
  }

  async findOne(id: number): Promise<FinalGood> {
    try {
      const finalGood = await this.finalGoodRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          organisation: true,
          billOfMaterial: true,
        },
      });
      return finalGood;
    } catch (err) {
      throw new NotFoundException(`The final good cannot be found`);
    }
  }

  async findTopSellingGoods(orgId: number, count: number) {
    const invoices = await this.invoicesService.findSentInvoicesByOrg(orgId);
    const goodsSales = new Map<number, number>();
    const date = new Date();
    for (const invoice of invoices) {
      if (invoice.status == InvoiceStatus.CLOSED) {
        const po = (await this.invoicesService.findOne(invoice.id)).po;
        if (
          invoice.paymentReceived.getMonth() == date.getMonth() &&
          invoice.paymentReceived.getFullYear() == date.getFullYear()
        ) {
          for (const poLineItem of po.poLineItems) {
            if (goodsSales.has(poLineItem.finalGood.id)) {
              const quantity =
                goodsSales.get(poLineItem.finalGood.id) + poLineItem.quantity;
              goodsSales.set(poLineItem.finalGood.id, quantity);
            } else {
              goodsSales.set(poLineItem.finalGood.id, poLineItem.quantity);
            }
          }
        }
      }
    }
    const mapSort1 = new Map(
      [...goodsSales.entries()].sort((a, b) => b[1] - a[1])
    );
    const finalGoods = [...mapSort1.keys()];
    let i = 0;
    const arr = [];
    while (mapSort1.has(finalGoods[i]) && i < count) {
      arr.push({
        name: (await this.findOne(finalGoods[i])).name,
        quantity: mapSort1.get(finalGoods[i]),
      });
      i++;
    }
    // const arr = [
    //   {name: (await this.findOne(finalGoods[0])).name, quantity: mapSort1.get(finalGoods[0])},
    //   {name: (await this.findOne(finalGoods[1])).name, quantity: mapSort1.get(finalGoods[1])},
    //   {name: (await this.findOne(finalGoods[2])).name, quantity: mapSort1.get(finalGoods[2])},
    //   {name: (await this.findOne(finalGoods[3])).name, quantity: mapSort1.get(finalGoods[3])},
    //   {name: (await this.findOne(finalGoods[4])).name, quantity: mapSort1.get(finalGoods[4])}
    // ]

    return arr;
  }

  async update(
    id: number,
    updateFinalGoodDto: UpdateFinalGoodDto
  ): Promise<FinalGood> {
    try {
      const product = await this.finalGoodRepository.findOne({
        where: {
          id,
        },
      });
      const keyValuePairs = Object.entries(updateFinalGoodDto);
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0];
        const value = keyValuePairs[i][1];
        if (value) {
          if (key === 'description') {
            product.description = value;
          } else if (key === 'unitPrice') {
            product.unitPrice = value;
          } else if (key === 'expiry') {
            product.expiry = value;
          } else if (key === 'skuCode') {
            product.skuCode = value;
          } else if (key === 'lotQuantity') {
            product.lotQuantity = value;
          }
        } else {
          product[key] = value;
        }
      }
      await this.finalGoodRepository.save(product);
      return this.findOne(id);
    } catch (err) {
      throw new NotFoundException(`The final good cannot be found`);
    }
  }

  async remove(id: number): Promise<FinalGood> {
    try {
      const product = await this.finalGoodRepository.findOneBy({ id });
      return this.finalGoodRepository.remove(product);
    } catch (err) {
      throw new NotFoundException(`The final good cannot be found`);
    }
  }

  async getDemandForecast(
    id: number,
    finalGoodsId: number,
    numOfMonths: number,
    seasonality: string
  ) {
    const url = 'http://127.0.0.1:5000/demand-forecast';
    const query = `
      SELECT 
        YEAR(created) as YEAR, 
        MONTH(created) as MONTH,
        SUM(quantity) as SUM
      FROM purchase_order 
      JOIN purchase_order_line_item
      ON purchase_order.id = purchase_order_line_item.purchaseOrderId
        AND purchase_order_line_item.finalGoodId = ${finalGoodsId}
      WHERE currentOrganisationId = ${id}
      GROUP BY Year(created), MONTH(created)
      ORDER BY YEAR, MONTH;
    `;
    const queryRunner = this.dataSource.createQueryRunner();
    const result = await queryRunner.manager.query(query);
    const dataForDemandPython = [];
    for (const row of result) {
      dataForDemandPython.push({
        date: dayjs()
          .year(row.YEAR)
          .month(row.MONTH - 1)
          .endOf('month')
          .toDate(),
        value: row.SUM,
      });
    }
    const season = seasonality === 'true';
    const data = {
      numOfMonths: numOfMonths,
      data: dataForDemandPython,
      seasonality: season,
    };
    return this.httpService
      .post(url, data)
      .pipe(
        map(async (res) => {
          let month = 1;
          for (
            let idx = res.data.length - numOfMonths;
            idx < res.data.length;
            idx++
          ) {
            res.data[idx].shortfall = await this.getShortFall(
              finalGoodsId,
              res.data[idx].val,
              id,
              month
            );
            month += 1;
          }
          // console.log(res.data)
          return res.data;
        })
      )
      .pipe(
        catchError(() => {
          throw new InternalServerErrorException('API is down');
        })
      );
  }

  async getShortFall(
    finalGoodsId: number,
    quantity: number,
    organisationId: number,
    numOfMonths: number
  ) {
    const inventory = await this.batchLineItemService.getAggregatedFinalGoods(
      organisationId,
      dayjs().add(numOfMonths, 'month').toDate()
    );
    if (inventory.has(Number(finalGoodsId))) {
      const lineItems = inventory.get(Number(finalGoodsId));
      const totalQty = lineItems.reduce((seed, lineItem) => {
        return seed + (lineItem.quantity - lineItem.reservedQuantity);
      }, 0);
      return Math.abs(totalQty - quantity);
    } else {
      return quantity;
    }
  }

  async getRequiredRawMaterialsFromFinalGoods(
    finalGoodsId: number,
    quantity: number
  ) {
    const billOfMaterial = await this.billOfMaterialService.getBOMFromFinalGood(
      finalGoodsId
    );

    const lotQuantity = Math.ceil(
      quantity / billOfMaterial.finalGood.lotQuantity
    );

    const rawMaterialsRequired = [];

    for (const lineItem of billOfMaterial.bomLineItems) {
      rawMaterialsRequired.push({
        rawMaterial: lineItem.rawMaterial,
        quantityRequired: lotQuantity * lineItem.quantity,
      });
    }

    return rawMaterialsRequired;
  }

  // async getShortFall(finalGoodsId: number, quantity: number, organisationId: number, numOfMonths: number) {
  //   const bom = await this.billOfMaterialService.getBOMFromFinalGood(finalGoodsId);
  //   const lineItems = await this.batchLineItemService.getLineItems(bom.id, quantity, organisationId, dayjs().add(numOfMonths, 'month').toDate());
  //   return lineItems;
  // }
}
