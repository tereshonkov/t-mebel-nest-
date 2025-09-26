import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('t-mebel API')
    .setDescription('Dashboard for web-app')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
}
