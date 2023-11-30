import { Module } from '@nestjs/common';
import { EmbedderService } from './embedder.service';
import { EmbedderController } from './embedder.controller';
import { Source, SourceSchema } from 'src/Source/source.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from 'src/Conversation/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [EmbedderService],
  controllers: [EmbedderController],
})
export class EmbedderModule {}
