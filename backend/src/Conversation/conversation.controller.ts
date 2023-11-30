import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateConversationInput } from './conversation.input';
import { ConversationService } from './conversation.service';
import { UserService } from '../User/user.service';
import { EmbedderService } from 'src/Embedder/embedder.service';

@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  constructor(
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
    private readonly embedderService: EmbedderService,
  ) {}

  @Post()
  async createConversation(@Body() body: CreateConversationInput) {
    // TODO: remove this when we have authentication
    const user = await this.userService.findUser('65669e9262814ba41fc9b8c3');

    const aiReply = await this.embedderService.getRelevantAnswer(body.message);

    const conversation = await this.conversationService.createConversation({
      user: user._id,
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
