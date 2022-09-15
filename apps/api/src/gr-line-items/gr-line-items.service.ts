import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateGrLineItemDto } from './dto/create-gr-line-item.dto';
import { UpdateGrLineItemDto } from './dto/update-gr-line-item.dto';
import { GrLineItem } from './entities/gr-line-item.entity';

@Injectable()
export class GrLineItemsService {
  constructor(@InjectRepository(GrLineItem)
  private readonly grLineItemRepository: Repository<GrLineItem>,
  private rawMaterialService: RawMaterialsService) {}

  async create(createGrLineItemsDto: CreateGrLineItemDto) {
    const grLineItem = new GrLineItem();
    grLineItem.subTotal = createGrLineItemsDto.subtotal;
    grLineItem.quantity = createGrLineItemsDto.quantity;

    const rawMaterial = await this.rawMaterialService.findOne(createGrLineItemsDto.rawMaterialId);
    grLineItem.product = rawMaterial;

    return this.grLineItemRepository.save(grLineItem);
  }

  findAll() {
    return this.grLineItemRepository.find();
  }

  findOne(id: number) {
    return this.grLineItemRepository.findOne({
      where: { id },
      relations: ["goodReceipt"]
    });
  }

  async update(id: number, updateGrLineItemDto: UpdateGrLineItemDto) {
    const grLineItem = await this.findOne(id);
    grLineItem.quantity = updateGrLineItemDto.quantity;
    grLineItem.subTotal = updateGrLineItemDto.subtotal;
    return this.grLineItemRepository.save(grLineItem);
  }

  remove(id: number) {
    return this.grLineItemRepository.delete(id);
  }
}
