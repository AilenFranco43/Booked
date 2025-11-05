import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Coordinates, CoordinatesSchema } from './coordinates.entity';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Property extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  photos: string[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: CoordinatesSchema })
  coordinates: Coordinates

  @Prop()
  max_people: number;

  @Prop()
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
