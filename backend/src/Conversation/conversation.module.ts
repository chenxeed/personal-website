import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserService } from '../User/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { Conversation, ConversationSchema } from './conversation.schema';
import { User, UserSchema } from '../User/user.schema';
import { EmbedderService } from '../Embedder/embedder.service';
import { ChatAnswerService } from '../ChatAnswer/chat-answer.service';
import { Source, SourceSchema } from '../Source/source.schema';
import { DailyQuota, DailyQuotaSchema } from '../DailyQuota/daily-quota.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]),
    MongooseModule.forFeature([
      { name: DailyQuota.name, schema: DailyQuotaSchema },
    ]),
  ],
  providers: [
    ConversationService,
    UserService,
    EmbedderService,
    ChatAnswerService,
  ],
  controllers: [ConversationController],
})
export class ConversationModule {}
