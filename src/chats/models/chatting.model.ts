import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { SchemaOptions, Document, Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Socket as SocketModel } from './socket.model';

const options: SchemaOptions = {
  collection: 'chatting',
  timestamps: true,
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      id: { type: String, required: true },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  @IsString()
  user: SocketModel;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
