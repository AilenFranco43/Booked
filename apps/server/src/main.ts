import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Booked')
    .setDescription(
      'Booked is a property rental app that connects hosts with travelers seeking temporary stays. It offers easy property listings, flexible bookings, and secure payments, providing a seamless experience for both hosts and guests.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    // origin: ['https://bookedfrontend.vercel.app', 'http://localhost:3000'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  Logger.log(`App listen in: http://localhost:${PORT}/api`);
}

bootstrap();

