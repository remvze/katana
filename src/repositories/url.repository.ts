import type { Types } from 'mongoose';

import UrlModel from '@/models/url.model';
import type { IUrl } from '@/models/url.model';
import { dbConnect } from '@/database/mongo';

class UrlRepository {
  async createUrl(url: Partial<IUrl>) {
    await dbConnect();

    const data = await UrlModel.create(url);

    return data.toObject() as IUrl;
  }

  async getUrl(hashedSlug: string) {
    await dbConnect();

    const data = await UrlModel.findOne({
      hashed_slug: hashedSlug,
    }).lean<IUrl>();

    if (data?.is_deleted) return null;

    return data;
  }

  async getUrlById(id: Types.ObjectId) {
    await dbConnect();

    const data = await UrlModel.findById(id).lean<IUrl>();

    if (data?.is_deleted) return null;

    return data;
  }

  async updateUrl(id: Types.ObjectId, updatedUrl: Partial<IUrl>) {
    await dbConnect();

    const data = await UrlModel.findByIdAndUpdate(id, updatedUrl, {
      new: true,
    }).lean<IUrl>();

    return data;
  }

  async deleteUrl(id: Types.ObjectId) {
    await dbConnect();

    const data = await UrlModel.findByIdAndUpdate(
      id,
      {
        encrypted_url: '[DELETED]',
        is_deleted: true,
      },
      { new: true },
    ).lean<IUrl>();

    return data;
  }
}

export const urlRepository = new UrlRepository();
