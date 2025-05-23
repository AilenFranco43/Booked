import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { PropertyParamsDto } from './dto/property-params.dto';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, userId: User): Promise<Property> {
    const newProperty = new this.propertyModel({
      ...createPropertyDto,
      userId: userId
    });
    return newProperty.save();
  }

  async findAll(params: PropertyParamsDto) {
    const filters = this.buildFilters(params);
    let query = this.propertyModel.find(filters);
    
    if (params.orderBy) {
      const sortOrder = params.orderBy === 'ASC' ? 1 : -1;
      query = query.sort({ price: sortOrder });
    } else {
      query = query.sort({ createdAt: 1 });
    }

    return await query.exec();
  }

  async findAllWithAverageRating(params: PropertyParamsDto) {
    const { sortByRating, ...filterParams } = params;
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'property',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: '$reviews' }, 0] },
              { $avg: '$reviews.rating' },
              0
            ]
          },
          reviewCount: { $size: '$reviews' }
        }
      },
      { $match: this.buildFilters(filterParams) }
    ];

    if (sortByRating) {
      pipeline.push({
        $sort: {
          averageRating: sortByRating === 'desc' ? -1 : 1,
          reviewCount: -1
        }
      });
    }

    return this.propertyModel.aggregate(pipeline).exec();
  }

  async debugRatingTest() {
    const testPipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'property',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' }
        }
      },
      { 
        $sort: { 
          averageRating: -1 as const,
          reviewCount: -1 as const 
        } 
      },
      { $limit: 5 },
      { 
        $project: {
          title: 1,
          averageRating: 1,
          reviewCount: 1,
          hasReviews: { $gt: [{ $size: '$reviews' }, 0] }
        }
      }
    ];

    return this.propertyModel.aggregate(testPipeline).exec();
  }

  private buildFilters(params: Omit<PropertyParamsDto, 'sortByRating'>): any {
    const filters: any = {};
    
    if (params.title) {
      filters.title = { $regex: params.title, $options: 'i' };
    }

    if (params.min_people !== undefined) {
      filters.max_people = { $gte: params.min_people };
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      filters.price = {};
      if (params.minPrice !== undefined) {
        filters.price.$gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        filters.price.$lte = params.maxPrice;
      }
    }

    if (params.tags) {
      const tagsArray = Array.isArray(params.tags) ? params.tags : [params.tags];
      if (tagsArray.length > 0) {
        filters.tags = { $in: tagsArray };
      }
    }

    if (params.address) {
      filters.address = { $regex: params.address, $options: 'i' };
    }

    return filters;
  }

  async findAllByUserId(userId: string) {
    const objectUserId = new Types.ObjectId(userId);
    const properties = await this.propertyModel.find({ userId: objectUserId }).exec();
    if (!properties || properties.length === 0) {
      throw new NotFoundException(`No properties found for user with ID ${userId}`);
    }
    return properties;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    await this.findOneById(id);
    return this.propertyModel.findByIdAndUpdate(id, updatePropertyDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Property> {
    return this.propertyModel.findByIdAndDelete(id).exec();
  }

  async findOneById(propertyId: string): Promise<Property> {
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property with id ${propertyId} not found`);
    }
    return property;
  }

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