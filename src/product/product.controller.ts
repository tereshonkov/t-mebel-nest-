import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../common/role.decorator';
import { Role } from '@prisma/client';
import { ProductRequest } from './dto/product.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiQuery({
    name: 'locale',
    required: false,
    enum: ['uk', 'ru', 'en'],
    description: 'Локаль текста карточки (совпадает с next-intl)',
  })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Get('products')
  async getAll(@Query('locale') locale?: string) {
    return this.productService.getAll(locale);
  }

  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiQuery({
    name: 'locale',
    required: false,
    enum: ['uk', 'ru', 'en'],
    description: 'Локаль текста карточки',
  })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Get('product/:id')
  async getById(
    @Param('id') id: string,
    @Query('locale') locale?: string,
  ) {
    return this.productService.getById(id, locale);
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
