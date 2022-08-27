import { Injectable } from '@nestjs/common';
import { CreateFactoryMachineDto } from './dto/create-factory-machine.dto';
import { UpdateFactoryMachineDto } from './dto/update-factory-machine.dto';

@Injectable()
export class FactoryMachinesService {
  create(createFactoryMachineDto: CreateFactoryMachineDto) {
    return 'This action adds a new factoryMachine';
  }

  findAll() {
    return `This action returns all factoryMachines`;
  }

  findOne(id: number) {
    return `This action returns a #${id} factoryMachine`;
  }

  update(id: number, updateFactoryMachineDto: UpdateFactoryMachineDto) {
    return `This action updates a #${id} factoryMachine`;
  }

  remove(id: number) {
    return `This action removes a #${id} factoryMachine`;
  }
}
