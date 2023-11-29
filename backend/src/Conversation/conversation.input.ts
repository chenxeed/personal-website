import { IsString } from 'class-validator';

export class CreateConversationInput {
  @IsString()
  message: string;
}
