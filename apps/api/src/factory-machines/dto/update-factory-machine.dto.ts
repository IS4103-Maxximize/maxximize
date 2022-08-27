import { PartialType } from '@nestjs/mapped-types';
import { CreateFactoryMachineDto } from './create-factory-machine.dto';

export class UpdateFactoryMachineDto extends PartialType(CreateFactoryMachineDto) {}
