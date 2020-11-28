import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vacancy extends Document {
  @Prop()
  title: string;

  @Prop()
  description: number;

  @Prop()
  expiredAt: string;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
