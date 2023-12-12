import { Module } from '@nestjs/common';
import { EmbedderService } from './embedder.service';
import { EmbedderController } from './embedder.controller';
import { Source, SourceSchema } from 'src/Source/source.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]),
  ],
  providers: [EmbedderService],
  controllers: [EmbedderController],
})
export class EmbedderModule {}
