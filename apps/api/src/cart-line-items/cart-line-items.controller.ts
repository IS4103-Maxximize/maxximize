import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartLineItemsService } from './cart-line-items.service';
import { CreateCartLineItemDto } from './dto/create-cart-line-item.dto';
import { UpdateCartLineItemDto } from './dto/update-cart-line-item.dto';

@Controller('cart-line-items')
export class CartLineItemsController {
  constructor(private readonly cartLineItemsService: CartLineItemsService) {}

  @Post()
  create(@Body() createCartLineItemDto: CreateCartLineItemDto) {
    return this.cartLineItemsService.create(createCartLineItemDto);
  }

  @Get()
  findAll() {
    return this.cartLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartLineItemDto: UpdateCartLineItemDto) {
    return this.cartLineItemsService.update(+id, updateCartLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartLineItemsService.remove(+id);
  }
}
