import { Types } from 'mongoose';

import { dbConnect } from '@/database/mongo';
import UrlModel from '@/models/url.model';
import { normalizeId } from '@/lib/normalizer';

import type { UrlDocument } from '@/models/url.model';

class UrlRepository {
  async createUrl(urlData: Partial<UrlDocument>) {
    await dbConnect();

    const doc = await UrlModel.create(urlData);

    return doc ? normalizeId(doc.toObject()) : null;
  }

  async getUrl(hashedSlug: string) {
    await dbConnect();

    const document = await UrlModel.findOne({ hashedSlug }).lean<UrlDocument>();

    return document ? normalizeId(document) : null;
  }

  async getUrlById(id: string) {
    await dbConnect();

    const document = await UrlModel.findById(
      new Types.ObjectId(id),
    ).lean<UrlDocument>();

    return document ? normalizeId(document) : null;
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

    return document ? normalizeId(document) : null;
  }

  async deleteUrl(id: string) {
    await dbConnect();

    const document = await UrlModel.findByIdAndDelete(id, {
      new: true,
    }).lean<UrlDocument>();

    return document ? normalizeId(document) : null;
  }
}

export const urlRepository = new UrlRepository();
