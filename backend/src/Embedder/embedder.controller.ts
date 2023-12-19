import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EmbedderService, EmbeddingType } from './embedder.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'embedder',
  version: '1',
})
export class EmbedderController {
  constructor(private readonly embedderService: EmbedderService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createEmbedDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: EmbeddingType,
  ) {
    const embedder = await this.embedderService.createSource({
      file,
      type,
    });
    return embedder;
  }

  @Delete('/sources/:sourceId')
  async clearEmbedDocument(@Param('sourceId') sourceId: string) {
    await this.embedderService.clearSource(sourceId);
  }
}
