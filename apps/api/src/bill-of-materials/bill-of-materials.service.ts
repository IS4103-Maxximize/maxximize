import { Injectable } from '@nestjs/common';
import { CreateBillOfMaterialDto } from './dto/create-bill-of-material.dto';
import { UpdateBillOfMaterialDto } from './dto/update-bill-of-material.dto';

@Injectable()
export class BillOfMaterialsService {
  create(createBillOfMaterialDto: CreateBillOfMaterialDto) {
    return 'This action adds a new billOfMaterial';
  }

  findAll() {
    return `This action returns all billOfMaterials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} billOfMaterial`;
  }

  update(id: number, updateBillOfMaterialDto: UpdateBillOfMaterialDto) {
    return `This action updates a #${id} billOfMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} billOfMaterial`;
  }
}
