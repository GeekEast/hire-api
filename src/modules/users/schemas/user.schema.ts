import mongoose from 'mongoose';
import { Company } from 'modules/companies/schemas/company.schema';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  hashed_password: string;

  @Prop({ required: true, enum: ['user', 'admin'] })
  role: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Company?.name || 'Company',
  })
  company?: Company;
}

export const UserSchema = SchemaFactory.createForClass(User);
