import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { CreateAccountInfoDto } from './dto/create-account-info.dto';
import { UpdateAccountInfoDto } from './dto/update-account-info.dto';
import { AccountInfo } from './entities/account-info.entity';

@Injectable()
export class AccountInfoService {
  constructor(
    @InjectRepository(AccountInfo)
    private readonly accountInfoRepository: Repository<AccountInfo>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>
  ) {}
  async create(createAccountInfoDto: CreateAccountInfoDto) {
    const {bankCode, bankName, accountNumber, organisationId} = createAccountInfoDto
    let organisationToBeAdded: Organisation = await this.organisationsRepository.findOneByOrFail({id: organisationId})
    const newAccountInfo = this.accountInfoRepository.create({
      bankCode,
      bankName,
      accountNumber,
      organisation: organisationToBeAdded
    })
    return this.accountInfoRepository.save(newAccountInfo)
  }

  findAll() {
    return this.accountInfoRepository.find({relations: {
      organisation: true
    }})
  }

  findOne(id: number) {
    return this.accountInfoRepository.findOneOrFail({
      where: {id},
      relations: {
        organisation: true
      }
    })
  }

  async update(id: number, updateAccountInfoDto: UpdateAccountInfoDto) {
    const accountInfoToUpdate = await this.accountInfoRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateAccountInfoDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      accountInfoToUpdate[key] = value
    })
    return this.accountInfoRepository.save(accountInfoToUpdate)
  }

  async remove(id: number) {
    const accountInfoToRemove = await this.findOne(id)
    return this.accountInfoRepository.remove(accountInfoToRemove)
  }
}
