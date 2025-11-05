// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { MulterModule } from '@nestjs/platform-express'; // Si necesitas personalizar Multer

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // O el directorio que prefieras
    }), // Solo si quieres usar Multer para algo más que la carga básica
  ],
  providers: [CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}


