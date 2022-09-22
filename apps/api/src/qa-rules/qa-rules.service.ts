import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateQaRuleDto } from './dto/create-qa-rule.dto';
import { UpdateQaRuleDto } from './dto/update-qa-rule.dto';
import { QaRule } from './entities/qa-rule.entity';

@Injectable()
export class QaRulesService {
  constructor(private organisationService: OrganisationsService,
    @InjectRepository(QaRule)
    private readonly qaRuleRepository: Repository<QaRule>) {}
  async create(createQaRuleDto: CreateQaRuleDto) {
    const { title, description, category, organisationId} = createQaRuleDto
    const organisation = await this.organisationService.findOne(organisationId)
    const newQaRule = this.qaRuleRepository.create({
      title,
      description,
      category,
      created: new Date(),
      organisationId: organisation.id
    })
    return this.qaRuleRepository.save(newQaRule)
  }

  async findAll() {
    const [qaRules, count] = await this.qaRuleRepository.findAndCount({
      relations: {
        organisation: true
      }
    })
    if (count > 0) {
      return qaRules
    } else {
      throw new NotFoundException('No QA Rule found!')
    }
  }

  async findAllByOrg(id: number) {
    const [qaRules, count] = await this.qaRuleRepository.findAndCount({
      where: {
        organisationId: id
      },
      relations: {
        organisation: true
      }
    })
    if (count > 0) {
      return qaRules
    } else {
      throw new NotFoundException(`No QaRules found for this organisation with id: ${id}`)
    }
  }

  async findOne(id: number) {
    try {
      return await this.qaRuleRepository.findOneOrFail({
        where: {
          id
        }, relations: {
          organisation: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`Qa rule of id: ${id} cannot be found`)
    }
    
  }

  async update(id: number, updateQaRuleDto: UpdateQaRuleDto) {
    const keyValuePairs = Object.entries(updateQaRuleDto)
    const qaRuleToUpdate = await this.findOne(id)
    for (const [key, value] of keyValuePairs) {
      qaRuleToUpdate[key] = value
    }
    return this.qaRuleRepository.save(qaRuleToUpdate)
  }

  async remove(id: number) {
    const qaRuleToRemove = await this.findOne(id)
    return this.qaRuleRepository.remove(qaRuleToRemove) 
  }
}
