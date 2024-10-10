import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface StatisticDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  date: Date;
  totalClicks: number;
  totalLinksCreated: number;
  totalLinksDeleted: number;
  updatedAt: Date;
}

const StatisticSchema = new Schema<StatisticDocument>(
  {
    date: { required: true, type: Date, unique: true },
    totalClicks: { default: 0, type: Number },
    totalLinksCreated: { default: 0, type: Number },
    totalLinksDeleted: { default: 0, type: Number },
  },
  { timestamps: true },
);

export default mongoose.models.Statistic ||
  mongoose.model<StatisticDocument>('Statistic', StatisticSchema);
