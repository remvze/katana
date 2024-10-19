import { createRedisClient } from '@/database/redis';
import { UrlModel } from '@/models/url.model';
import type { Url } from '@/models/url.model';

class UrlRepository {
  private client = createRedisClient();

  async createUrl(urlData: UrlModel) {
    const key = `url:${urlData.hashedSlug}`;
    const exists = await this.getUrl(urlData.hashedSlug);

    if (exists) throw new Error('URL already exists');

    await this.client.hset(key, urlData.toJSON());

    if (urlData.expireAfter) {
      await this.client.expire(key, Number(urlData.expireAfter));
    }
  }

  async getUrl(hashedSlug: string) {
    const key = `url:${hashedSlug}`;
    const url = await this.client.hgetall(key);

    const urlObject = url ? UrlModel.fromJSON(url as unknown as Url) : null;

    if (urlObject && urlObject.expireAfter) {
      const ttl = await this.client.ttl(key);

      if (
        ttl <= 0 ||
        new Date(urlObject.createdAt + urlObject.expireAfter).getTime() <
          Date.now()
      ) {
        await this.deleteUrl(hashedSlug);

        return null;
      }
    }

    return urlObject;
  }

  async updateUrl(hashedSlug: string, updateData: Partial<Url>) {
    const key = `url:${hashedSlug}`;
    const url = await this.getUrl(hashedSlug);

    if (!url) throw new Error("URL doesn't exist");

    const newUrl = { ...url, ...updateData };

    await this.client.hset(key, newUrl);

    return newUrl;
  }

  async deleteUrl(hashedSlug: string) {
    const key = `url:${hashedSlug}`;

    await this.client.del(key);
  }
}

export const urlRepository = new UrlRepository();
