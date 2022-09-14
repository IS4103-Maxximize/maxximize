import { PartialType } from '@nestjs/mapped-types';
import { CreateGoodsReceiptDto } from './create-goods-receipt.dto';

export class UpdateGoodsReceiptDto extends PartialType(CreateGoodsReceiptDto) {}
