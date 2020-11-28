import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  useranme: string;

  @Prop()
  hashed_password: string;

  @Prop()
  roles: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
