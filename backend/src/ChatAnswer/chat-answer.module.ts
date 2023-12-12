import { Module } from '@nestjs/common';
import { ChatAnswerService } from './chat-answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from 'src/Conversation/conversation.schema';
import {
  DailyQuota,
  DailyQuotaSchema,
} from 'src/DailyQuota/daily-quota.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyQuota.name, schema: DailyQuotaSchema },
    ]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ChatAnswerService],
})
export class ChatAnswerModule {}
