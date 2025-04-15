import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Asegúrate de importar el servicio

@Injectable()
export class ImageService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // Función para actualizar la imagen
  async updateImage(public_id: string, file: Express.Multer.File): Promise<string> {
    return this.cloudinaryService.updateImage(public_id, file); // Llama a la función de CloudinaryService
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const uploadStream = this.cloudinaryService.uploader.upload_stream(  // Usando uploader inyectado
            { resource_type: 'image' },
            (error, result) => {
              if (error) {
                return reject(new Error('Error uploading image to Cloudinary'));
              }
              resolve(result.secure_url); // Devuelve la URL segura de la imagen
            },
          );
          uploadStream.end(file.buffer); // Envía el archivo a Cloudinary
        }),
    );

    return Promise.all(uploadPromises); // Espera a que todas las imágenes se suban
  }
}
