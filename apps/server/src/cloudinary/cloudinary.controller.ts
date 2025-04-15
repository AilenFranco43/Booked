// src/cloudinary/cloudinary.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express'; // Para manejar la carga de archivos
import { ApiBody, ApiTags } from '@nestjs/swagger'; // Para la documentación con Swagger si es necesario

@ApiTags('cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // Endpoint para generar la firma de Cloudinary
  @Post('signature')
  async generateSignature(@Body() body: { timestamp: number; folder: string }) {
    const { timestamp, folder } = body;

    if (!timestamp || !folder) {
      throw new HttpException('Falta timestamp o folder', HttpStatus.BAD_REQUEST);
    }

    try {
      const signature = await this.cloudinaryService.generateSignature({ timestamp, folder });
      return { signature };
    } catch (error) {
      console.error('Error al generar la firma:', error);
      throw new HttpException('Error al generar la firma', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Endpoint para actualizar la imagen en Cloudinary
  @Post('update/:public_id')
  @UseInterceptors(FileInterceptor('file')) // Usando el interceptor para manejar el archivo subido
  async updateImage(
    @Param('public_id') publicId: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new HttpException('Archivo no recibido', HttpStatus.BAD_REQUEST);
    }

    try {
      const imageUrl = await this.cloudinaryService.updateImage(publicId, file);
      return { imageUrl };
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      throw new HttpException('Error al actualizar la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
