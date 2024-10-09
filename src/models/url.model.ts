import mongoose from 'mongoose';
import type { Types } from 'mongoose';

export interface IUrl extends mongoose.Document {
  _id: Types.ObjectId;
  clicks: number;
  createdAt: Date;
  destruction_key: string;
  encrypted_url: string;
  hashed_slug: string;
  is_deleted: boolean;
  is_password_protected: boolean;
  updatedAt: Date;
}

const UrlSchema = new mongoose.Schema<IUrl>(
  {
    clicks: {
      default: 0,
      type: Number,
    },
    destruction_key: {
      required: true,
      type: String,
    },
    encrypted_url: {
      require: true,
      type: String,
    },
    hashed_slug: {
      require: true,
      type: String,
    },
    is_deleted: {
      default: false,
      type: Boolean,
    },
    is_password_protected: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Url || mongoose.model<IUrl>('Url', UrlSchema);