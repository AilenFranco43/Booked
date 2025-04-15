import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';

import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    PropertyModule,
    ReservationsModule,
    ReviewModule,
    AuthModule,
    PaymentsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
