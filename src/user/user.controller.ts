import { Controller, Param, Get, Delete, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from '.prisma/client/edge';
import { Roles } from 'src/common/role.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiBadRequestResponse({ description: 'Ошибка при получении пользователей' })
  @ApiOkResponse({ description: 'Пользователи успешно получены' })
  @Get('users')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiBadRequestResponse({ description: 'Ошибка при получении пользователя' })
  @ApiOkResponse({ description: 'Пользователь успешно получен' })
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiBadRequestResponse({ description: 'Ошибка при удалении пользователя' })
  @ApiOkResponse({ description: 'Пользователь успешно удален' })
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
