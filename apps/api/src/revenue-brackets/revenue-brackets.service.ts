import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRevenueBracketDto } from './dto/create-revenue-bracket.dto';
import { UpdateRevenueBracketDto } from './dto/update-revenue-bracket.dto';
import { RevenueBracket } from './entities/revenue-bracket.entity';

@Injectable()
export class RevenueBracketsService {
  constructor(
    @InjectRepository(RevenueBracket)
    private readonly revenueBracketsRepository: Repository<RevenueBracket>
  ) {}
  create(createRevenueBracketDto: CreateRevenueBracketDto) {
    const {start, end, commisionRate} = createRevenueBracketDto
    const newBracket = this.revenueBracketsRepository.create({
      start,
      end,
      commisionRate,
      organisationId: 1
    })
    return this.revenueBracketsRepository.save(newBracket)
  }

  findAll() {
    return this.revenueBracketsRepository.find()
  }

  async findOne(id: number) {
    try {
      return await this.revenueBracketsRepository.findOneOrFail({
        where: {
          id
        }
      })
    } catch (error) {
      throw new NotFoundException(`revenue bracket with id: ${id} cannot be found!`)
    }
  }

  async update(id: number, updateRevenueBracketDto: UpdateRevenueBracketDto) {
    const bracketToUpdate = await this.findOne(id)
    const keyValues = Object.entries(updateRevenueBracketDto)
    for (const [key, value] of keyValues) {
      bracketToUpdate[key] = value
    }
    return this.revenueBracketsRepository.save(bracketToUpdate)
  }

  async remove(id: number) {
    const bracketToRemove = await this.findOne(id)
    return this.revenueBracketsRepository.remove(bracketToRemove)
  }
}
