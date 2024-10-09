import { Types } from 'mongoose';

import UrlModel from '@/models/url.model';
import { dbConnect } from '@/database/mongo';
import type { UrlDocument } from '@/models/url.model';

import { UrlEntity } from '@/entities/url.entity';
import { UrlMapper } from '@/mappers/url.mapper';

class UrlRepository {
  async createUrl(entity: UrlEntity): Promise<UrlEntity | null> {
    await dbConnect();

    const newUrl = UrlMapper.toDocument(entity);
    const doc = await UrlModel.create(newUrl);

    return doc ? UrlMapper.toEntity(doc.toObject()) : null;
  }

  async getUrl(hashedSlug: string): Promise<UrlEntity | null> {
    await dbConnect();

    const doc = await UrlModel.findOne({
      hashed_slug: hashedSlug,
    }).lean<UrlDocument>();

    return doc ? UrlMapper.toEntity(doc) : null;
  }

  async getUrlById(id: string): Promise<UrlEntity | null> {
    await dbConnect();

    const doc = await UrlModel.findById(
      new Types.ObjectId(id),
    ).lean<UrlDocument>();

    return doc ? UrlMapper.toEntity(doc) : null;
  }

  async updateUrl(id: string, entity: UrlEntity): Promise<UrlEntity | null> {
    await dbConnect();

    const doc = await UrlModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      UrlMapper.toDocument(entity),
      {
        new: true,
      },
    ).lean<UrlDocument>();

    return doc ? UrlMapper.toEntity(doc) : null;
  }

  async deleteUrl(id: string): Promise<UrlEntity | null> {
    await dbConnect();

    const doc = await UrlModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        encrypted_url: '[DELETED]',
        is_deleted: true,
      },
      { new: true },
    ).lean<UrlDocument>();

    return doc ? UrlMapper.toEntity(doc) : null;
  }
}

export const urlRepository = new UrlRepository();
