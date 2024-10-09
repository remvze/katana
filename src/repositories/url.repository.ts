import { Types } from 'mongoose';

import UrlModel from '@/models/url.model';
import { dbConnect } from '@/database/mongo';
import {
  fromCreateUrlDTO,
  fromUpdateUrlDTO,
  toUrlDTO,
} from '@/mappers/url.mapper';
import type { UrlDocument } from '@/models/url.model';
import type { CreateUrlDTO, UpdateUrlDTO } from '@/dtos/url.dto';

class UrlRepository {
  async createUrl(url: CreateUrlDTO) {
    await dbConnect();

    const newUrl = fromCreateUrlDTO(url);

    const data = await UrlModel.create(newUrl);

    return data ? toUrlDTO(data.toObject()) : null;
  }

  async getUrl(hashedSlug: string) {
    await dbConnect();

    const data = await UrlModel.findOne({
      hashed_slug: hashedSlug,
    }).lean<UrlDocument>();

    if (data?.is_deleted) return null;

    return data ? toUrlDTO(data) : null;
  }

  async getUrlById(id: string) {
    await dbConnect();

    const data = await UrlModel.findById(
      new Types.ObjectId(id),
    ).lean<UrlDocument>();

    if (data?.is_deleted) return null;

    return data ? toUrlDTO(data) : null;
  }

  async updateUrl(id: string, updatedUrl: UpdateUrlDTO) {
    await dbConnect();

    const updated = fromUpdateUrlDTO(updatedUrl);

    const data = await UrlModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updated,
      {
        new: true,
      },
    ).lean<UrlDocument>();

    return data ? toUrlDTO(data) : null;
  }

  async deleteUrl(id: string) {
    await dbConnect();

    const data = await UrlModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        encrypted_url: '[DELETED]',
        is_deleted: true,
      },
      { new: true },
    ).lean<UrlDocument>();

    return data ? toUrlDTO(data) : null;
  }
}

export const urlRepository = new UrlRepository();
