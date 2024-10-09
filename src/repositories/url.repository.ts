import { Types } from 'mongoose';

import { dbConnect } from '@/database/mongo';
import UrlModel from '@/models/url.model';

import type { UrlDocument } from '@/models/url.model';

class UrlRepository {
  private normalize(doc: UrlDocument) {
    const { _id, ...rest } = doc;

    return { ...rest, id: _id.toString() };
  }

  async createUrl(urlData: Partial<UrlDocument>) {
    await dbConnect();

    const doc = await UrlModel.create(urlData);

    return doc ? this.normalize(doc.toObject()) : null;
  }

  async getUrl(hashedSlug: string) {
    await dbConnect();

    const document = await UrlModel.findOne({ hashedSlug }).lean<UrlDocument>();

    if (!document || document?.isDeleted) return null;

    return this.normalize(document);
  }

  async getUrlById(id: string) {
    await dbConnect();

    const document = await UrlModel.findById(
      new Types.ObjectId(id),
    ).lean<UrlDocument>();

    if (!document || document?.isDeleted) return null;

    return this.normalize(document);
  }

  async updateUrl(id: string, updateData: Partial<UrlDocument>) {
    await dbConnect();

    const document = await UrlModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updateData,
      {
        new: true,
      },
    ).lean<UrlDocument>();

    return document ? this.normalize(document) : null;
  }

  async deleteUrl(id: string) {
    await dbConnect();
    const document = await UrlModel.findByIdAndUpdate(
      id,
      { encryptedUrl: '[DELETED]', isDeleted: true },
      { new: true },
    ).lean<UrlDocument>();

    return document ? this.normalize(document) : null;
  }
}

export const urlRepository = new UrlRepository();
