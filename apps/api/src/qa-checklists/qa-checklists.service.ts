import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { QaRule } from '../qa-rules/entities/qa-rule.entity';
import { QaRulesService } from '../qa-rules/qa-rules.service';
import { CreateQaChecklistDto } from './dto/create-qa-checklist.dto';
import { UpdateQaChecklistDto } from './dto/update-qa-checklist.dto';
import { QaChecklist } from './entities/qa-checklist.entity';

@Injectable()
export class QaChecklistsService {
  constructor(private organisationService: OrganisationsService,
    private qaRuleService: QaRulesService,
    @InjectRepository(QaChecklist)
    private readonly qaChecklistRepository: Repository<QaChecklist>) {}
  async create(createQaChecklistDto: CreateQaChecklistDto) {
    const {productType, qaRuleIds, organisationId} = createQaChecklistDto
    const organisation = await this.organisationService.findOne(organisationId)
    let qaRulesToBeAdded: QaRule[] = []
    for (const id of qaRuleIds) {
      const qaRule = await this.qaRuleService.findOne(id)
      qaRulesToBeAdded.push(qaRule)
    }
    const newChecklist = this.qaChecklistRepository.create({
      productType,
      qaRules: qaRulesToBeAdded,
      organisationId: organisation.id
    })
    return this.qaChecklistRepository.save(newChecklist)
  }

  async findAll() {
    const [qaChecklists, count] = await this.qaChecklistRepository.findAndCount({
      relations: {
        organisation: true,
        qaRules: true
      }
    })
    if (count > 0) {
      return qaChecklists
    } else {
      throw new NotFoundException('No checklists found!')
    }
  }

  async findAllByOrg(id: number) {
    const [qaChecklists, count] = await this.qaChecklistRepository.findAndCount({
      where: {
        id
      },
      relations: {
        organisation: true,
        qaRules: true
      }
    })
    if (count > 0) {
      return qaChecklists
    } else {
      throw new NotFoundException('No Checklists found!')
    }
  }

  async findOne(id: number) {
    try {
      return await this.qaChecklistRepository.findOneOrFail({
        where: {
          id
        },
        relations: {
          organisation: true,
          qaRules: true
        } 
      })
    } catch (error) {
      throw new NotFoundException(`cannot find checklist with id: ${id}`)
    }
  }

  async update(id: number, updateQaChecklistDto: UpdateQaChecklistDto) {
    //can only update productType and qaRules
    const {productType, qaRuleIds} = updateQaChecklistDto
    const checklistToUpdate = await this.findOne(id)
    if (productType) {
      checklistToUpdate.productType = productType
    }
    if (qaRuleIds) {
      checklistToUpdate.qaRules = await this.retrieveQaRules(qaRuleIds)
    }
    return this.qaChecklistRepository.save(checklistToUpdate)
  }

  async remove(id: number) {
    const checklistToRemove = await this.findOne(id)
    return this.qaChecklistRepository.remove(checklistToRemove)
  }

  async retrieveQaRules(qaRuleIds: number[]) {
    let rules: QaRule[] = []
    for (const id of qaRuleIds) {
      const rule = await this.qaRuleService.findOne(id)
      rules.push(rule)
    }
    return rules
  }
}
