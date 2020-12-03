import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Company extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true })
  address: string;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: User?.name || 'User' }],
  // })
  // users: User[];

  // @Prop({
  //   type: [
  //     { type: mongoose.Schema.Types.ObjectId, ref: Vacancy?.name || 'Vacancy' },
  //   ],
  // })
  // vacancies: Vacancy[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
