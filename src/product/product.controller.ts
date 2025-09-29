import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Get, Body, Post, Put } from '@nestjs/common';
import { Roles } from '../common/role.decorator';
import { Role } from '.prisma/client/wasm';
import { ProductRequest } from './dto/product.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Get('products')
  async getAll() {
    return this.productService.getAll();
  }

  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Get('product/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @ApiOperation({ summary: 'Создать продукт (только для админа)' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create-product')
  async createProduct(@Body() dto: ProductRequest) {
    return this.productService.createProduct(dto);
  }

  @ApiOperation({ summary: 'Удалить продукт (только для админа)' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('delete-product/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @ApiOperation({ summary: 'Обновить продукт (только для админа)' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('update-product/:id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductRequest) {
    return this.productService.updateProduct(id, dto);
  }
}
