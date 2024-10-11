import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface UrlDocument extends Document {
  _id: Types.ObjectId;
  clicks: number;
  createdAt: Date;
  destructionKey: string;
  encryptedUrl: string;
  expireAt: Date | null;
  hashedSlug: string;
  isPasswordProtected: boolean;
  updatedAt: Date;
}

const UrlSchema = new Schema<UrlDocument>(
  {
    clicks: { default: 0, type: Number },
    destructionKey: { required: true, type: String },
    encryptedUrl: { required: true, type: String },
    expireAt: { default: null, type: Date },
    hashedSlug: { required: true, type: String },
    isPasswordProtected: { default: false, type: Boolean },
  },
  { timestamps: true },
);

UrlSchema.index({ hashedSlug: 1 });
UrlSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Url ||
  mongoose.model<UrlDocument>('Url', UrlSchema);
