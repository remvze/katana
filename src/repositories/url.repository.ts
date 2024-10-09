import { Types } from 'mongoose';

import UrlModel from '@/models/url.model';
import type { UrlDocument } from '@/models/url.model';
import { dbConnect } from '@/database/mongo';
import type { UrlDTO } from '@/dtos/url.dto';

class UrlRepository {
  private toDTO(url: UrlDocument): UrlDTO {
    const dto: UrlDTO = {
      clicks: url.clicks,
      createdAt: url.createdAt,
      destructionKey: url.destruction_key,
      encryptedUrl: url.encrypted_url,
      hashedSlug: url.hashed_slug,
      id: url._id.toString(),
      isDeleted: url.is_deleted,
      isPasswordProtected: url.is_password_protected,
      updatedAt: url.updatedAt,
    };

    return dto;
  }

  private fromDTO(dto: Partial<UrlDTO>): Partial<UrlDocument> {
    const url: Partial<UrlDocument> = {
      clicks: dto.clicks,
      destruction_key: dto.destructionKey,
      encrypted_url: dto.encryptedUrl,
      hashed_slug: dto.hashedSlug,
      is_deleted: dto.isDeleted,
      is_password_protected: dto.isPasswordProtected,
    };

    return url;
  }

  async createUrl(url: Partial<UrlDocument>) {
    await dbConnect();

    const data = await UrlModel.create(url);

    return data ? this.toDTO(data.toObject()) : null;
  }

  async getUrl(hashedSlug: string) {
    await dbConnect();

    const data = await UrlModel.findOne({
      hashed_slug: hashedSlug,
    }).lean<UrlDocument>();

    if (data?.is_deleted) return null;

    return data ? this.toDTO(data) : null;
  }

  async getUrlById(id: string) {
    await dbConnect();

    const data = await UrlModel.findById(
      new Types.ObjectId(id),
    ).lean<UrlDocument>();

    if (data?.is_deleted) return null;

    return data ? this.toDTO(data) : null;
  }

  async updateUrl(id: string, updatedUrl: Partial<UrlDTO>) {
    await dbConnect();

    const updated = this.fromDTO(updatedUrl);

    const data = await UrlModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updated,
      {
        new: true,
      },
    ).lean<UrlDocument>();

    return data ? this.toDTO(data) : null;
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

    return data ? this.toDTO(data) : null;
  }
}

export const urlRepository = new UrlRepository();
