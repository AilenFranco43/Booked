import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Property.name) private propertyModel: Model<Property>
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    // Convertir IDs a ObjectId
    const propertyId = new Types.ObjectId(createReviewDto.property);
    const guestId = new Types.ObjectId(createReviewDto.guest);

    // Verificar existencia
    const [propertyExist, userExist] = await Promise.all([
      this.propertyModel.findById(propertyId).exec(),
      this.userModel.findById(guestId).exec()
    ]);

    if (!propertyExist) {
      throw new NotFoundException(`Property with ID ${createReviewDto.property} not found`);
    }
    if (!userExist) {
      throw new NotFoundException(`User with ID ${createReviewDto.guest} not found`);
    }

    const newReview = new this.reviewModel({
      ...createReviewDto,
      property: propertyId,
      guest: guestId
    });

    await newReview.save();
    
    // Actualizar rating promedio de la propiedad
    await this.updatePropertyRating(propertyId);
    
    return newReview;
  }

  private async updatePropertyRating(propertyId: Types.ObjectId) {
    const result = await this.reviewModel.aggregate([
      { $match: { property: propertyId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]).exec();

    if (result.length > 0) {
      await this.propertyModel.findByIdAndUpdate(
        propertyId,
        { $set: { averageRating: result[0].avgRating } },
        { new: true }
      ).exec();
    }
  }

  async findAll() {
    return this.reviewModel.find()
      .populate('guest', 'name email')
      .populate('property', 'title')
      .exec();
  }

  async findByProperty(propertyId: string) {
    const objectId = new Types.ObjectId(propertyId);
    const reviews = await this.reviewModel.find({ property: objectId })
      .populate('guest', 'name')
      .exec();

    if (!reviews.length) {
      throw new NotFoundException(`No reviews found for property with ID ${propertyId}`);
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    return {
      reviews,
      averageRating: parseFloat(averageRating.toFixed(2)),
      count: reviews.length
    };
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id)
      .populate('guest', 'name')
      .populate('property', 'title address')
      .exec();
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const updateData: any = { ...updateReviewDto };
    
    // Convertir IDs si están presentes
    if (updateReviewDto.property) {
      updateData.property = new Types.ObjectId(updateReviewDto.property);
    }
    if (updateReviewDto.guest) {
      updateData.guest = new Types.ObjectId(updateReviewDto.guest);
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Actualizar rating si cambió
    if (updateReviewDto.rating !== undefined) {
      await this.updatePropertyRating(updatedReview.property);
    }

    return updatedReview;
  }

  async remove(id: string) {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Actualizar rating de la propiedad
    await this.updatePropertyRating(review.property);
    
    return review;
  }

  // Método para migrar datos existentes (ejecutar una sola vez)
  async migrateData() {
    const reviews = await this.reviewModel.find({
      $or: [
        { property: { $type: 'string' } },
        { guest: { $type: 'string' } }
      ]
    }).exec();

    const updates = reviews.map(review => ({
      updateOne: {
        filter: { _id: review._id },
        update: {
          $set: {
            ...(typeof review.property === 'string' && { 
              property: new Types.ObjectId(review.property) 
            }),
            ...(typeof review.guest === 'string' && { 
              guest: new Types.ObjectId(review.guest) 
            })
          }
        }
      }
    }));

    if (updates.length > 0) {
      await this.reviewModel.bulkWrite(updates);
    }

    return { migrated: updates.length };
  }
}