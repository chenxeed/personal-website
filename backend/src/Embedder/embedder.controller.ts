import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EmbedderService } from './embedder.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'embedder',
  version: '1',
})
export class EmbedderController {
  constructor(private readonly embedderService: EmbedderService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createEmbedDocument(@UploadedFile() file: Express.Multer.File) {
    const embedder = await this.embedderService.createSource({
      file,
    });
    return embedder;
  }

  @Delete('/sources/:sourceId')
  async clearEmbedDocument(@Param('sourceId') sourceId: string) {
    await this.embedderService.clearSource(sourceId);
  }

  @Get('/:searchText')
  async getRelevantAnswer(@Param('searchText') searchText: string) {
    const relevantAnswer =
      await this.embedderService.getRelevantAnswer(searchText);
    return relevantAnswer;
  }
}
