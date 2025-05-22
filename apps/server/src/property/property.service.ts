import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { PropertyParamsDto } from './dto/property-params.dto';
import { User } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, userId: User): Promise<Property> {
    const {
      title,
      description,
      price,
      max_people,
      tags,
      photos,
      address,
      coordinates,
    } = createPropertyDto;

    const newProperty = new this.propertyModel({
      title,
      description,
      price,
      photos,
      max_people,
      tags,
      address,
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      userId: userId
    });

    return newProperty.save();
  }

  async findAll(params: PropertyParamsDto) {
    const { title, minPrice, maxPrice, tags, orderBy, address, min_people } = params;

    // Inicializar el filtro vacío
    const filters: any = {};

    // Agregar filtros solo si existen los parámetros
    if (title) {
      filters.title = { $regex: title, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
    }


    // Filtro por cantidad de personas

    if (min_people !== undefined) {
  filters.max_people = { $gte: min_people };
}

    // Filtro por rango de precios
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) {
        filters.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filters.price.$lte = maxPrice;
      }
    }

    
    if (tags) {
      // Si es un string, conviértelo a un arreglo
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      
      // Verificar si tagsArray está vacío o no
      if (tagsArray.length > 0) {
        filters.tags = { $in: tagsArray }; // Buscar propiedades que tengan cualquiera de los tags
      }
    }


    
    // Filtro por zona si está presente (búsqueda flexible con regex)
    if (address) {
      filters.address = { $regex: address, $options: 'i' }; // Buscar en el campo 'address' por coincidencias parciales
    }

    // Construir la consulta
    let query = this.propertyModel.find(filters);
    
    // Ordenar
     if (params.orderBy) {
    const sortOrder = params.orderBy === 'ASC' ? 1 : -1;
    query = query.sort({ price: sortOrder }); // Ordenar por precio en lugar de createdAt
  } else {
    query = query.sort({ createdAt: 1 }); // Orden por defecto
  }

    return await query.exec(); // Ejecutar la consulta con exec()
  }

  // GetByUserId
  async findAllByUserId(userId: string) {
    const objectUserId = new Types.ObjectId(userId)
    const properties = await this.propertyModel.find({ userId: objectUserId }).exec();
    if (!properties || properties.length === 0) {
      throw new NotFoundException(
        `No properties found for user with ID ${userId}`,
      );
    }
    return properties;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    await this.findOneById(id);

    const updatedProperty = this.propertyModel.findByIdAndUpdate(
      id,
      updatePropertyDto,
      { new: true },
    );

    return updatedProperty;
  }

  async remove(id: string): Promise<Property> {
    return this.propertyModel.findByIdAndDelete(id).exec();
  }

  async findOneById(propertyId: string): Promise<Property> {
    const property = await this.propertyModel.findById(propertyId);

    if (!property)
      throw new NotFoundException(`Property with id ${propertyId} not found`);

    return property;
  }
  // Obtener ciudades
  async getUniqueCities(): Promise<string[]> {
    const properties = await this.propertyModel.find({}).exec();
    const cities = new Set<string>();
    
    properties.forEach(property => {
      const addressParts = property.address?.split(',') || [];
      if (addressParts.length >= 3) {
        const city = addressParts[addressParts.length - 2].trim();
        if (city && !city.includes('Ciudad no disponible')) {
          cities.add(city);
        }
      }
    });
    
    return Array.from(cities).sort();
  }
}
