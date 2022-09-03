import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
  ) {}

  create(createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
    const newOrganisation = 
    {
      ...createOrganisationDto
    }
    return this.organisationsRepository.save(newOrganisation);
  }

  findAll(): Promise<Organisation[]> {
    return this.organisationsRepository.find({
      relations: {
        customers: true,
        suppliers: true
      }
    });
  }

  async findOne(id: number): Promise<Organisation> {
    try {
      const organisation =  await this.organisationsRepository.findOne({where: {
        id
      }, relations: {
        customers: true,
        suppliers: true
      }})
      return organisation
    } catch (err) {
      throw new NotFoundException(`findOne failed as Organization with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateOrganisationDto: UpdateOrganisationDto): Promise<Organisation> {
    const businessRelationsProperties = ['suppliers', 'customers']
    try {
      let organisation = await this.organisationsRepository.findOne({where: {
        id
      }, relations: {
        suppliers: true,
        customers: true
      }})
      const keyValuePairs = Object.entries(updateOrganisationDto)
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0]
        const value = keyValuePairs[i][1]
        //fields in updateOrganisationDto are optional, so check if the value is present or null
        if (value) {
          if (businessRelationsProperties.includes(key)) {
            if (key === 'suppliers') {
              organisation = await this.assignSuppliers(updateOrganisationDto.suppliers, organisation)
            }
            if (key === 'customers') {
              organisation = await this.assignCustomers(updateOrganisationDto.customers, organisation)
            }
          } else {
            organisation[key] = value
          }
        }
      }
      await this.organisationsRepository.save(organisation)
      return this.organisationsRepository.findOne({where: {
        id
      }, relations: {
        suppliers: true,
        customers: true
      }})
    } catch (err) {
      throw new NotFoundException(`update Failed as Organization with id: ${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<Organisation> {
    try {
      const organisation = await this.organisationsRepository.findOneBy({id})
      return this.organisationsRepository.remove(organisation);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Organization with id: ${id} cannot be found`)
    }
  }

  async assignSuppliers(supplierIds: number[], organisation: Organisation): Promise<Organisation> {
    try {
      //retrieve list of organisations to be added as suppliers
      const supplierPromises = supplierIds.map(async id => {
        const supplier = await this.organisationsRepository.findOne({where: {
          id
        }, relations: {
          customers: true
        }})
        return supplier
      })
      const suppliers = await Promise.all(supplierPromises)

      //add organisation to each supplier's customers list
      suppliers.forEach(supplier => {
        this.addCustomerToSupplier(organisation, supplier)
      })

      //get the Diff in previous suppliers and new suppliers
      const removedSuppliers = this.getDiff(organisation.suppliers, suppliers)

      //remove organisation as customer from diff
      removedSuppliers.forEach(supplier => {
        this.removeCustomerFromSupplier(organisation, supplier)
      })
      //assign suppliers to organisation
      organisation = {
        ...organisation,
        suppliers
      }
      return organisation
    } catch (err) {
      throw err
    }
  }

  addCustomerToSupplier(organisation: Organisation, supplier: Organisation) {
    const supplierCustomerIds = supplier.customers.map(customer => customer.id)
    if (!supplierCustomerIds.includes(organisation.id)) {
      supplier.customers.push(organisation)
    }
    this.organisationsRepository.save(supplier)
  }

  addSupplierToCustomer(organisation: Organisation, customer: Organisation) {
    const customerSupplierIds = customer.suppliers.map(supplier => supplier.id)
    if (!customerSupplierIds.includes(organisation.id)) {
      customer.suppliers.push(organisation)
    }
    this.organisationsRepository.save(customer)
  }

  getDiff(oldList: Organisation[], newList: Organisation[]): Organisation[] {
    const newListIds = newList.map(organisation => organisation.id)
    return oldList.filter(organisation => {
      return !newListIds.includes(organisation.id)
    })
  }

  async removeCustomerFromSupplier(organisation: Organisation, supplier: Organisation) {
    let supplierToUpdate = supplier
    if (!supplier.customers) {
      supplierToUpdate = await this.organisationsRepository.findOne({
        where: {
          id: supplier.id
        }, relations: {
          customers: true
        }
      })
    }
    const supplierCustomerIds = supplierToUpdate.customers.map(customer => customer.id)
    if (supplierCustomerIds.includes(organisation.id)) {
      const indexOfOrganisation = supplierToUpdate.customers.findIndex(customer => customer.id === organisation.id)
        supplierToUpdate.customers.splice(indexOfOrganisation, 1)
    }
    this.organisationsRepository.save(supplierToUpdate)
  }

  async removeSupplierFromCustomer(organisation: Organisation, customer: Organisation) {
    let customerToUpdate = customer
    if (!customer.suppliers) {
      customerToUpdate = await this.organisationsRepository.findOne({
        where: {
          id: customer.id
        }, relations: {
          suppliers: true
        }
      })
    }
    const customerSupplierIds = customerToUpdate.suppliers.map(customer => customer.id)
    if (customerSupplierIds.includes(organisation.id)) {
      const indexOfOrganisation = customerToUpdate.suppliers.findIndex(supplier => supplier.id === organisation.id)
        customerToUpdate.suppliers.splice(indexOfOrganisation, 1)
    }
    this.organisationsRepository.save(customerToUpdate)
  }


  async assignCustomers(customerIds: number[], organisation: Organisation): Promise<Organisation> {
    try {
      //retrieve list of organisations to be added as customers
      const customerPromises = customerIds.map(async id => {
        const customer = await this.organisationsRepository.findOne({where: {
          id
        }, relations: {
          suppliers: true
        }})
        return customer
      })
      const customers = await Promise.all(customerPromises)

      //add organisation to each customer's supplier list
      customers.forEach(customer => {
        this.addSupplierToCustomer(organisation, customer)
      })

      //get the Diff in previous customers and new customers
      const removedCustomers = this.getDiff(organisation.customers, customers)

      //remove organisation as customer from diff
      removedCustomers.forEach(customer => {
        this.removeSupplierFromCustomer(organisation, customer)
       
      })
      //assign suppliers to organisation
      organisation = {
        ...organisation,
        customers
      }
      return organisation
    } catch (err) {
      throw err
    }
  }
}
