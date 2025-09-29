import {
  Controller,
  Param,
  Body,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ImageRequest } from './dto/image.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from '@prisma/client/wasm';
import { Roles } from 'src/common/role.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Получить все изображения' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Get('images')
  async getAllImages() {
    return await this.imagesService.getAllImages();
  }

  @ApiOperation({ summary: 'Получить изображение по ID' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @Get('images/:id')
  async getById(@Param('id') id: string) {
    return await this.imagesService.getImageById(id);
  }

  @ApiOperation({ summary: 'Добавить изображение (только для админа)' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post('create-image')
  async addImage(@Body() dto: ImageRequest) {
    return await this.imagesService.addImage(dto);
  }

  @ApiOperation({ summary: 'Удалить изображение (только для админа)' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete('delete-image/:id')
  async deleteImage(@Param('id') id: string) {
    return await this.imagesService.deleteImage(id);
  }

  @ApiOperation({ summary: 'Обновить изображение (только для админа)' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Put('update-image/:id')
  async putImage(@Param('id') id: string, @Body() dto: ImageRequest) {
    return await this.imagesService.updateImage(id, dto);
  }
}
