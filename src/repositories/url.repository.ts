import { storage } from '@/database/redis';
import { UrlModel } from '@/models/url.model';
import type { Url } from '@/models/url.model';

class UrlRepository {
  async createUrl(urlData: UrlModel) {
    const key = `url:${urlData.hashedSlug}`;
    const exists = await this.getUrl(urlData.hashedSlug);

    if (exists) throw new Error('URL already exists');

    await storage.setItem(key, urlData.toJSON(), {
      ttl: urlData.expireAfter ?? null,
    });
  }

  async getUrl(hashedSlug: string) {
    const key = `url:${hashedSlug}`;
    const url = await storage.getItem<Url>(key);

    return url;
  }

  async updateUrl(hashedSlug: string, updateData: Partial<Url>) {
    const key = `url:${hashedSlug}`;
    const url = await this.getUrl(hashedSlug);

    if (!url) throw new Error("URL doesn't exist");

    const newUrl = { ...url, ...updateData };

    await storage.setItem(key, newUrl);

    return newUrl;
  }

  async deleteUrl(hashedSlug: string) {
    const key = `url:${hashedSlug}`;

    await storage.del(key);
  }
}

export const urlRepository = new UrlRepository();
