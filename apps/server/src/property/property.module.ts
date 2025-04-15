import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { ImageService } from './image.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './entities/property.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Asegúrate de importar el CloudinaryService

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    ImageService,
    CloudinaryService, // Inyecta directamente el servicio de Cloudinary
  ],
  exports: [PropertyService], // Exporta PropertyService para usarlo en otros módulos
})
export class PropertyModule {}
