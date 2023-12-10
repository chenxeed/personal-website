import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
})
export class Chat {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  author: 'ai' | 'user';

  @Prop()
  refinedMessage: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
