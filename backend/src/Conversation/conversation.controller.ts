import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateConversationInput } from './conversation.input';
import { ConversationService } from './conversation.service';
import { EmbedderService } from 'src/Embedder/embedder.service';

@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly embedderService: EmbedderService,
  ) {}

  @Post()
  async createConversation(@Body() body: CreateConversationInput) {
    const aiReply = await this.embedderService.getRelevantAnswer(body.message);

    const conversation = await this.conversationService.createConversation({
      user: '',
      message: body.message,
      aiReply,
    });

    return {
      conversation,
      aiReply,
    };
  }

  @Get('/:id')
  async getConversation(@Param('id') id: string) {
    const conversation = await this.conversationService.getConversation(id);
    return conversation;
  }

  @Patch('/:id')
  async appendConversationChat(
    @Param('id') id: string,
    @Body() body: CreateConversationInput,
  ) {
    const aiReply = await this.embedderService.getRelevantAnswer(body.message);
    await this.conversationService.appendConversationChat({
      ...body,
      conversationId: id,
      aiReply,
    });
    return {
      aiReply,
    };
  }
}
