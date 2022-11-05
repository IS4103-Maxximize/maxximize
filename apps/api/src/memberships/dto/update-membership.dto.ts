import { PartialType } from '@nestjs/mapped-types';
import { MembershipStatus } from '../enums/membership-status.enum';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';
import { CreateMembershipDto } from './create-membership.dto';

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {
    subscriptionId?: string
    plan?: SubscriptionPlan
    cancelAt?: Date
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    daysUntilDue?: number
    planAmount?: number
    status?: MembershipStatus
    defaultPayment?: string
}
