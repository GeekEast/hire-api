import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Company extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true })
  address: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
