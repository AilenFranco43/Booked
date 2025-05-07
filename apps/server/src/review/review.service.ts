import { Injectable , NotFoundException,} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity'
import { Property } from '../property/entities/property.entity'
import { Model } from 'mongoose';

@Injectable()
export class ReviewService {
constructor(
@InjectModel(Review.name) private reviewModel: Model<Review>,
@InjectModel(User.name) private userModel: Model<User>,
@InjectModel(Property.name) private propertyModel: Model<Property>

) {}

  async create(createReviewDto: CreateReviewDto) {
    const { property, guest, rating, comment } =
    createReviewDto;

    const propertyExist = await this.propertyModel.findById(property).exec();
    if(!propertyExist){
      throw new NotFoundException(`Property with ID ${property} not found`)
    }

    const userExist = await this.userModel.findById(guest).exec();
    if(!userExist){
      throw new NotFoundException(`User with ID ${guest} not found`)
    }

    const newReview = new this.reviewModel({
      property,  
      guest,
      rating,
      comment,
    });

    return newReview.save();
  }

  async findAll() {
    return this.reviewModel.find().exec();
  }

  async findByProperty(propertyId: string) {
    const reviews = await this.reviewModel
      .find({ property: propertyId })
      .populate('guest', 'name')
      .exec();
  
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(`No reviews found for property with ID ${propertyId}`);
    }
  
    // Calcular el rating promedio
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
    return {
      reviews,
      averageRating,
      count: reviews.length
    };
  }

  async findOne(id: string) {
    return this.reviewModel.findById(id).exec();
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
