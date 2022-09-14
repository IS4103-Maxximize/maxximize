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
    return `This action returns all grLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grLineItem`;
  }

  update(id: number, updateGrLineItemDto: UpdateGrLineItemDto) {
    return `This action updates a #${id} grLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} grLineItem`;
  }
}
