import { SchemaOptions, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

const options: SchemaOptions = {
  id: false, // mongoose 의 기본 _id 와 id 를 같게 설정
  collection: 'sockets',
  timestamps: true,
};

@Schema(options)
export class Socket extends Document {
  @Prop({ unique: true, required: true })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export const SocketSchema = SchemaFactory.createForClass(Socket);
