import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SourceDocument = HydratedDocument<Source>;

@Schema({ collection: 'sources', timestamps: true })
export class Source {
  @Prop({ required: true, unique: true })
  filename: string;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
