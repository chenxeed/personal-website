import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateConversationInput } from './conversation.input';
import { ConversationService } from './conversation.service';
import { EmbedderService } from '../Embedder/embedder.service';
import { ChatAnswerService } from '../ChatAnswer/chat-answer.service';

@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly embedderService: EmbedderService,
    private readonly chatAnswerService: ChatAnswerService,
  ) {}

  @Post()
  async createConversation(@Body() body: CreateConversationInput) {
    const { aiReply, refinedQuestion } = await this.processUserQuestion(
      body.message,
    );

    const conversation = await this.conversationService.createConversation({
      user: '',
      message: body.message,
      aiReply,
      refinedMessage: refinedQuestion,
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
    const { aiReply, refinedQuestion } = await this.processUserQuestion(
      body.message,
      id,
    );
    await this.conversationService.appendConversationChat({
      ...body,
      conversationId: id,
      aiReply,
      refinedQuestion,
    });
    return {
      aiReply,
    };
  }

  async processUserQuestion(
    question: string,
    conversationId?: string,
  ): Promise<{ aiReply: string; refinedQuestion: string }> {
    const checkQuota = await this.chatAnswerService.validateQuota();
    if (checkQuota === false) {
      return {
        aiReply:
          'Sorry, we have reached the daily quota. I need to limit the quota since I need to preserve the cost of the API usage. Please try again tomorrow!',
        refinedQuestion: '',
      };
    }

    let chatHistoryText = '';
    if (conversationId) {
      chatHistoryText =
        await this.chatAnswerService.getChatHistory(conversationId);
    }

    const refinedQuestion = await this.chatAnswerService.getRefinedQuestion(
      question,
      chatHistoryText,
    );

    const sources =
      await this.embedderService.getRelevantSources(refinedQuestion);

    const aiReply = await this.chatAnswerService.getRelevantAnswer(
      question,
      sources,
    );

    return {
      aiReply,
      refinedQuestion,
    };
  }
}
