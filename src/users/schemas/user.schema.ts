import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  hashed_password: string;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
