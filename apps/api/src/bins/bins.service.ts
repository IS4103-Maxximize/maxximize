import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RacksService } from '../racks/racks.service';
import { WarehousesService } from '../warehouses/warehouses.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
import { Bin } from './entities/bin.entity';

@Injectable()
export class BinsService {
  constructor(
    @InjectRepository(Bin)
    private readonly binRepository: Repository<Bin>,
    private dataSource: DataSource,
    private warehouseService: WarehousesService,
    private rackService: RacksService
  ) {}

  async create(createBinDto: CreateBinDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bin = new Bin();
      bin.name = createBinDto.name;
      bin.capacity = createBinDto.capacity;
      bin.currentCapacity = 0;
      bin.batchLineItems = [];

      const rack = await this.rackService.findOne(
        createBinDto.rackId
      );
      bin.rack = rack;

      const createdBin = await queryRunner.manager.save(bin);
      await queryRunner.commitTransaction();
      return createdBin;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const bins = await this.binRepository.find({
      relations: ['rack', 'batchLineItems.product'],
    });
    if (bins.length === 0 || bins === undefined) {
      throw new NotFoundException('No bin(s) found!');
    } else {
      return bins;
    }
  }

  async findOne(id: number) {
    const bin = await this.binRepository.findOne({
      where: {
        id: id,
      },
      relations: ['rack', 'batchLineItems.product'],
    });
    if (bin) {
      return bin;
    } else {
      throw new NotFoundException(`No bin ${id} found!`);
    }
  }

  async findAllByOrganisationId(id: number) {
    return await this.binRepository.find({
      where: {
        rack: {
          warehouse: {
            organisation: {
              id: id,
            }
          },
        },
      },
      relations: {
        rack: {
          warehouse: true
        },
        batchLineItems: {
          product: true,
        },
      },
    });
  }

  async update(id: number, updateBinDto: UpdateBinDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Bin, id, updateBinDto);
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.binRepository.delete(id);
  }
}
