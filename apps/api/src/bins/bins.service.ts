import { Injectable } from '@nestjs/common';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';

@Injectable()
export class BinsService {
  create(createBinDto: CreateBinDto) {
    return 'This action adds a new bin';
  }

  findAll() {
    return `This action returns all bins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bin`;
  }

  update(id: number, updateBinDto: UpdateBinDto) {
    return `This action updates a #${id} bin`;
  }

  remove(id: number) {
    return `This action removes a #${id} bin`;
  }
}
