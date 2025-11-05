import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { ImageService } from './image.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './entities/property.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ReviewModule } from '../review/review.module'; 
import { Review, ReviewSchema } from '../review/entities/review.entity';

@Module({
  imports: [
    ConfigModule,
    ReviewModule, 
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    ImageService,
    CloudinaryService,
  ],
  exports: [PropertyService],
})
export class PropertyModule {}