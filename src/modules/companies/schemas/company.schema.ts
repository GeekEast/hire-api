import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'modules/users/schemas/user.schema';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';

@Schema()
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User?.name || 'User' }],
  })
  users: User[];

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: Vacancy?.name || 'Vacancy' },
    ],
  })
  vacancies: Vacancy[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
