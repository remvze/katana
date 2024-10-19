import { storage } from '@/database/redis';
import { UrlModel } from '@/models/url.model';
import type { Url } from '@/models/url.model';

class UrlRepository {
  async createUrl(urlData: UrlModel) {
    const key = `url:${urlData.hashedSlug}`;
    const exists = await this.getUrl(urlData.hashedSlug);

    if (exists) throw new Error('URL already exists');

    await storage.setItem(key, urlData.serialize(), {
      ttl: urlData.expireAfter ?? null,
    });
  }

  async getUrl(hashedSlug: string) {
    const key = `url:${hashedSlug}`;
    const data = await storage.getItem<Url>(key);

    if (!data) return null;

    const urlModel = UrlModel.deserialize(data);

    if (
      urlModel.expireAfter &&
      urlModel.createdAt + urlModel.expireAfter * 1000 < Date.now()
    ) {
      await this.deleteUrl(urlModel.hashedSlug);

      return null;
    }

    return urlModel;
  }

  async updateUrl(hashedSlug: string, updateData: Partial<Url>) {
    const key = `url:${hashedSlug}`;
    const url = await this.getUrl(hashedSlug);

    if (!url) throw new Error("URL doesn't exist");

    const updatedUrl = { ...url, ...updateData };
    const updatedUrlModel = UrlModel.deserialize(updatedUrl);

    await storage.setItem(key, updatedUrlModel.serialize());

    return updatedUrlModel;
  }

  async deleteUrl(hashedSlug: string) {
    const key = `url:${hashedSlug}`;

    await storage.del(key);
  }
}

export const urlRepository = new UrlRepository();
