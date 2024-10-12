import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface SecretDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  encryptedFile: null | string;
  encryptedNote: string;
  expiresAt: Date;
  hashedPublicId: string;
  isPasswordProtected: boolean;
  remainingViews: number | null;
  updatedAt: Date;
}

const SecretSchema = new Schema<SecretDocument>(
  {
    encryptedFile: { default: null, type: String },
    encryptedNote: { required: true, type: String },
    expiresAt: { require: true, type: Date },
    hashedPublicId: { required: true, type: String, unique: true },
    isPasswordProtected: { default: false, type: Boolean },
    remainingViews: { default: null, type: Number },
  },
  { timestamps: true },
);

SecretSchema.index({ hashedPublicId: 1 });
SecretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Secret ||
  mongoose.model<SecretDocument>('Secret', SecretSchema);
