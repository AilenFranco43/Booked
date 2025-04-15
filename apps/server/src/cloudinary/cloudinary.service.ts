import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config(); // Asegura que las variables de entorno sean cargadas

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  // Exponer el uploader directamente
  uploader = cloudinary.uploader;

  // Función para actualizar una imagen
  async updateImage(public_id: string, file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.uploader.upload_stream(
        {
          public_id, // Usa el mismo public_id para reemplazar la imagen
          overwrite: true, // Asegúrate de que se reemplace
        },
        (error, result) => {
          if (error) {
            console.error('Error al actualizar la imagen:', error); // Agrega logs para ayudar a depurar
            return reject(new Error('Error al actualizar la imagen en Cloudinary'));
          }
          console.log('Imagen actualizada correctamente:', result); // Muestra el resultado para depuración
          resolve(result.secure_url); // Devuelve la URL segura de la imagen
        }
      );
      // Envía el archivo buffer al stream
      uploadStream.end(file.buffer); 
    });
  }
  
  async generateSignature(paramsToSign: Record<string, any>): Promise<string> {
    if (!paramsToSign || !paramsToSign.timestamp) {
      throw new Error('Faltan parámetros obligatorios para la firma, especialmente el timestamp.');
    }
  
    // Añadir otros parámetros si es necesario
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET,
    );
    
    return signature;
  }
  
}
