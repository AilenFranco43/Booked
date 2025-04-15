import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Property } from '../../property/entities/property.entity';
/*
import { Booking } from './booking.model';
import { Review } from './review.model';
*/
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true })
  nationality: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Property' }] })
  properties: Property[];

  @Prop()
  avatar: string;
  /*
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Booking' }] })
  bookings: Booking[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  reviews: Review[];
  */
}

export const UserSchema = SchemaFactory.createForClass(User);
