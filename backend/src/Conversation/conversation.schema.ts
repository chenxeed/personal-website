import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chat } from './chat.schema';

@Schema({ collection: 'conversations', timestamps: true })
export class Conversation {
  @Prop({ type: [{ type: Chat }] })
  chats: Chat[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
