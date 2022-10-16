import { PartialType } from '@nestjs/mapped-types';
import { ApplicationStatus } from '../enums/applicationStatus.enum';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    status: ApplicationStatus
}
