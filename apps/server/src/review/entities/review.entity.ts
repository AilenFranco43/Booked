import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';	
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../property/entities/property.entity';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  guest: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);


