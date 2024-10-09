import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface UrlDocument extends Document {
  _id: Types.ObjectId;
  clicks: number;
  createdAt: Date;
  destructionKey: string;
  encryptedUrl: string;
  hashedSlug: string;
  isDeleted: boolean;
  isPasswordProtected: boolean;
  updatedAt: Date;
}

const UrlSchema = new Schema<UrlDocument>(
  {
    clicks: { default: 0, type: Number },
    destructionKey: { required: true, type: String },
    encryptedUrl: { required: true, type: String },
    hashedSlug: { required: true, type: String },
    isDeleted: { default: false, type: Boolean },
    isPasswordProtected: { default: false, type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.models.Url ||
  mongoose.model<UrlDocument>('Url', UrlSchema);
