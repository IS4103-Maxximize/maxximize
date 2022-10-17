import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleStatus } from './enums/vehicleStatus.enum';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private organisationsService: OrganisationsService,
    private dataSource: DataSource
  ) {}
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const {description, isOperating, make, model, year, lastServiced, remarks, organisationId, licensePlate, loadCapacity, location } = createVehicleDto
    const organisation = await this.organisationsService.findOne(organisationId)
    const newVehicle = this.vehiclesRepository.create({
      description,
      isOperating,
      make,
      model,
      year,
      lastServiced,
      remarks,
      organisationId: organisation.id,
      licensePlate,
      loadCapacity,
      location,
      currentStatus: VehicleStatus.AVAILABLE
    })
    const newMachine = await this.vehiclesRepository.save(newVehicle)
    return this.findOne(newMachine.id);
  }

  findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      relations: {
        organisation: true,
        deliveryRequests: true
      }
    })
  }

  async findOne(id: number): Promise<Vehicle> {
    try {
      const vehicle = await this.vehiclesRepository.findOneOrFail({where: {
        id
      }, relations: {
        organisation: true,
        deliveryRequests: true
      }})
      return vehicle
    } catch (error) {
      throw new NotFoundException(`vehicle with id: ${id} cannot be found`)
    }
  }

  findAllByOrg(id: number): Promise<Vehicle[]> {
    return this.vehiclesRepository.createQueryBuilder('vehicle')
    .leftJoinAndSelect("vehicle.organisation", "organisation")
    .leftJoinAndSelect("vehicle.deliveryRequests", "deliveryRequests")
    .where("organisation.id = :id", {id})
    .getMany()
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    let vehicleToUpdate: Vehicle
    await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
      vehicleToUpdate = await transactionalEntityManager.findOne(Vehicle, {
        where: {
          id
        }
      })
      // const productionLineId = factoryMachineToUpdate.productionLineId
      const keyValuePairs = Object.entries(updateVehicleDto)
      for (const [key, value] of keyValuePairs) {
        // if (key === 'isOperating' && factoryMachineToUpdate.productionLineId) {
        //   await this.productionLineService.machineTriggerChange(value, factoryMachineToUpdate.id, productionLineId, transactionalEntityManager)
        // }
        // if (key === 'productionLineId') {
        //   await this.productionLineService.findOne(value)
        // }
        vehicleToUpdate[key] = value
      }
      return transactionalEntityManager.save(vehicleToUpdate)
    })
    return vehicleToUpdate
  }

  async remove(id: number): Promise<Vehicle> {
    const vehicleToRemove = await this.vehiclesRepository.findOneBy({id});
    return this.vehiclesRepository.remove(vehicleToRemove)
  }
}
