import mongoose from 'mongoose';
import { Company } from 'modules/companies/schemas/company.schema';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Vacancy extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  expiredAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Company?.name || 'Company',
  })
  company?: Company;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
