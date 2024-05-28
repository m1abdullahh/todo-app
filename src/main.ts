import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('The TodoApp')
    .setDescription('The TodoApp API description.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Synapse APIs',
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: -1,
      docExpansion: 'none',
    },
  });
  await app.listen(3000);
}
bootstrap();
