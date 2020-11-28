import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { User } from 'modules/users/schemas/user.schema';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import mongoose from 'mongoose';

@Schema()
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vacancy.name })
  vacancy: Vacancy[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
