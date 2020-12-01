import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Company } from 'modules/companies/schemas/company.schema';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Vacancy extends Document {
  @Prop()
  title: string;

  @Prop()
  description: number;

  @Prop()
  expiredAt: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Company?.name || 'Company',
  })
  company?: Company;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
