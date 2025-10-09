import { Controller, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Body, Post, Get, Param } from '@nestjs/common';
import { MessageRequest } from './dto/messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  async sendMessage(@Body() dto: MessageRequest): Promise<any> {
    return this.messagesService.createMessages(dto);
  }
  @Get()
  async getAllMessages(): Promise<any> {
    return this.messagesService.getMessages();
  }

  @Patch('read/:id')
  async markMessageAsRead(@Param('id') id: string): Promise<any> {
    return this.messagesService.markAsRead(id);
  }
}
