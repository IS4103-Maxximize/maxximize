import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QaRulesService } from './qa-rules.service';
import { CreateQaRuleDto } from './dto/create-qa-rule.dto';
import { UpdateQaRuleDto } from './dto/update-qa-rule.dto';

@Controller('qa-rules')
export class QaRulesController {
  constructor(private readonly qaRulesService: QaRulesService) {}

  @Post()
  create(@Body() createQaRuleDto: CreateQaRuleDto) {
    return this.qaRulesService.create(createQaRuleDto);
  }

  @Get()
  findAll() {
    return this.qaRulesService.findAll();
  }

  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.qaRulesService.findAllByOrg(+id)
  }

  @Get('ruleCategories')
  findAllCategories() {
    return this.qaRulesService.findAllRuleCategory()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qaRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQaRuleDto: UpdateQaRuleDto) {
    return this.qaRulesService.update(+id, updateQaRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qaRulesService.remove(+id);
  }
}
