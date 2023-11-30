import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DailyQuotaDocument = HydratedDocument<DailyQuota>;

@Schema({
  collection: 'daily-quota',
  timestamps: true,
})
export class DailyQuota {
  @Prop({ required: true, unique: true })
  day: string;

  @Prop({ required: true, default: 0 })
  quota: number;
}

export const DailyQuotaSchema = SchemaFactory.createForClass(DailyQuota);

export const MAX_DAILY_QUOTA = 50;
