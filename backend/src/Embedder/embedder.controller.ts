import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { EmbedderService, EmbeddingType } from './embedder.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

@Controller({
  path: 'embedder',
  version: '1',
})
export class EmbedderController {
  constructor(private readonly embedderService: EmbedderService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getEmbedDocuments() {
    const embedders = await this.embedderService.getSources();
    return embedders;
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete('/sources/:sourceId')
  async clearEmbedDocument(@Param('sourceId') sourceId: string) {
    await this.embedderService.clearSource(sourceId);
  }
}
