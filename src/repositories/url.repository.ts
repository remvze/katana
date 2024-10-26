import { db } from '@/database/drizzle';
import { urlsTable, type InsertUrl, type SelectUrl } from '@/database/schema';
import { eq, lt } from 'drizzle-orm';

class UrlRepository {
  async createUrl(urlData: InsertUrl) {
    const exists = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.hashedSlug, urlData.hashedSlug));

    if (exists[0]) throw new Error('URL already exists');

    await db.insert(urlsTable).values(urlData);
  }

  async getUrl(hashedSlug: SelectUrl['hashedSlug']) {
    const data = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.hashedSlug, hashedSlug));

    const url = data[0];

    if (!url) return null;

    // if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    //   await this.deleteUrl(url.hashedSlug);

    //   return null;
    // }

    return url;
  }

  async updateUrl(
    hashedSlug: SelectUrl['hashedSlug'],
    updateData: Partial<Omit<SelectUrl, 'id'>>,
  ) {
    const url = await this.getUrl(hashedSlug);

    if (!url) throw new Error("URL doesn't exist");

    await db
      .update(urlsTable)
      .set(updateData)
      .where(eq(urlsTable.hashedSlug, hashedSlug));
  }

  async deleteUrl(hashedSlug: string) {
    await db.delete(urlsTable).where(eq(urlsTable.hashedSlug, hashedSlug));
  }

  async deleteAllExpired() {
    await db.delete(urlsTable).where(lt(urlsTable.expiresAt, new Date()));
  }
}

export const urlRepository = new UrlRepository();
