import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateGrLineItemDto } from './dto/create-gr-line-item.dto';
import { UpdateGrLineItemDto } from './dto/update-gr-line-item.dto';
import { GrLineItem } from './entities/gr-line-item.entity';

@Injectable()
export class GrLineItemsService {
  constructor(@InjectRepository(GrLineItem)
  private readonly grLineItemRepository: Repository<GrLineItem>,
  private rawMaterialService: RawMaterialsService,
  private dataSource: DataSource) {}

  async create(createGrLineItemsDto: CreateGrLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const grLineItem = new GrLineItem();
      grLineItem.quantity = createGrLineItemsDto.quantity;

      const rawMaterial = await this.rawMaterialService.findOne(createGrLineItemsDto.rawMaterialId);
      grLineItem.product = rawMaterial;

      const createdGrLineItem =  await queryRunner.manager.save(grLineItem);
      await queryRunner.commitTransaction();
      return createdGrLineItem;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createWithExistingTransaction(createGrLineItemsDto: CreateGrLineItemDto, queryRunner: QueryRunner) {
    const grLineItem = new GrLineItem();
    grLineItem.quantity = createGrLineItemsDto.quantity;
    grLineItem.unitOfVolumetricSpace = createGrLineItemsDto.volumetricSpace / createGrLineItemsDto.quantity;

    const rawMaterial = await this.rawMaterialService.findOne(createGrLineItemsDto.rawMaterialId);
    grLineItem.product = rawMaterial;

    return queryRunner.manager.save(grLineItem);
  }

  findAll() {
    return this.grLineItemRepository.find({relations: ["goodsReceipt", "product"]});
  }

  findOne(id: number) {
    return this.grLineItemRepository.findOne({
      where: { id },
      relations: ["goodsReceipt", "product"]
    });
  }

  async update(id: number, updateGrLineItemDto: UpdateGrLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 
    try {
      const grLineItem = await this.findOne(id);
      grLineItem.quantity = updateGrLineItemDto.quantity;
      const updatedGrLineItem =  await queryRunner.manager.save(grLineItem);
      await queryRunner.commitTransaction();
      return updatedGrLineItem;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.grLineItemRepository.delete(id);
  }
}
