import { Injectable } from '@nestjs/common';
import { CreateFinalGoodDto } from './dto/create-final-good.dto';
import { UpdateFinalGoodDto } from './dto/update-final-good.dto';

@Injectable()
export class FinalGoodsService {
  create(createFinalGoodDto: CreateFinalGoodDto) {
    return 'This action adds a new finalGood';
  }

  findAll() {
    return `This action returns all finalGoods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finalGood`;
  }

  update(id: number, updateFinalGoodDto: UpdateFinalGoodDto) {
    return `This action updates a #${id} finalGood`;
  }

  remove(id: number) {
    return `This action removes a #${id} finalGood`;
  }
}
