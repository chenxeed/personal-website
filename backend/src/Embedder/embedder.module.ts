import { Module } from '@nestjs/common';
import { EmbedderService } from './embedder.service';
import { EmbedderController } from './embedder.controller';

@Module({
  providers: [EmbedderService],
  controllers: [EmbedderController],
})
export class EmbedderModule {}
