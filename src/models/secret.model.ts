import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface SecretDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  encryptedData: string;
  expireAt: Date;
  publicId: string;
  remainingViews: number | null;
  updatedAt: Date;
}

const SecretSchema = new Schema<SecretDocument>(
  {
    encryptedData: { required: true, type: String },
    expireAt: { require: true, type: Date },
    publicId: { required: true, type: String, unique: true },
    remainingViews: { default: null, type: Number },
  },
  { timestamps: true },
);

export default mongoose.models.Secret ||
  mongoose.model<SecretDocument>('Secret', SecretSchema);
