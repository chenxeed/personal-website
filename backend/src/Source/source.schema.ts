import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SourceDocument = HydratedDocument<Source>;

@Schema({
  collection: 'sources',
  timestamps: { createdAt: true, updatedAt: false },
})
export class Source {
  @Prop({ required: true })
  filename: string;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
