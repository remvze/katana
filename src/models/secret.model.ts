import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface SecretDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  encryptedFile: null | string;
  encryptedNote: string;
  expiresAt: Date;
  isPasswordProtected: boolean;
  publicId: string;
  remainingViews: number | null;
  updatedAt: Date;
}

const SecretSchema = new Schema<SecretDocument>(
  {
    encryptedFile: { default: null, type: String },
    encryptedNote: { required: true, type: String },
    expiresAt: { require: true, type: Date },
    isPasswordProtected: { default: false, type: Boolean },
    publicId: { required: true, type: String, unique: true },
    remainingViews: { default: null, type: Number },
  },
  { timestamps: true },
);

SecretSchema.index({ publicId: 1 });
SecretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Secret ||
  mongoose.model<SecretDocument>('Secret', SecretSchema);
