import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './entities/review.entity';
import { ReviewController } from './review.controller';
import {User, UserSchema} from '../users/entities/user.entity';
import {Property, PropertySchema} from '../property/entities/property.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema },
      {name: User.name, schema: UserSchema},
      {name: Property.name, schema: PropertySchema}
    ]),
  ],
  controllers: [ReviewController], 
  providers: [ReviewService],
  exports: [ReviewService], 
})
export class ReviewModule {}
