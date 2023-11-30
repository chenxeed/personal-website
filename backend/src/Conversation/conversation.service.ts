import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';
import { Chat } from './chat.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
  ) {}

  async createConversation(body: {
    user: Types.ObjectId;
    message: string;
    aiReply: string;
  }): Promise<Conversation> {
    const newChat = new this.chatModel({
      author: 'user',
      message: body.message,
    });
    const newAIChat = new this.chatModel({
      author: 'ai',
      message: body.aiReply,
    });

    const newConversation = new this.conversationModel({
      user: body.user,
      chats: [newChat, newAIChat],
    });
    const conversation = await newConversation.save();
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(id);
    return conversation;
  }

  async appendConversationChat(body: {
    conversationId: string;
    message: string;
    aiReply: string;
  }) {
    const newChat = new this.chatModel({
      author: 'user',
      message: body.message,
    });
    const newAIChat = new this.chatModel({
      author: 'ai',
      message: body.aiReply,
    });
    const conversation = await this.conversationModel.findByIdAndUpdate(
      body.conversationId,
      {
        $push: {
          chats: { $each: [newChat, newAIChat] },
        },
      },
      { new: true },
    );
    return conversation;
  }
}
