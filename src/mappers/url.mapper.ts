import { UrlEntity } from '@/entities/url.entity';
import type { UrlDocument } from '@/models/url.model';

export class UrlMapper {
  static toEntity(doc: UrlDocument): UrlEntity {
    return new UrlEntity({
      clicks: doc.clicks,
      createdAt: doc.createdAt,
      destructionKey: doc.destruction_key,
      encryptedUrl: doc.encrypted_url,
      hashedSlug: doc.hashed_slug,
      id: doc._id.toString(),
      isDeleted: doc.is_deleted,
      isPasswordProtected: doc.is_password_protected,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: UrlEntity): Partial<UrlDocument> {
    return {
      clicks: entity.clicks,
      destruction_key: entity.destructionKey,
      encrypted_url: entity.encryptedUrl,
      hashed_slug: entity.hashedSlug,
      is_deleted: entity.isDeleted,
      is_password_protected: entity.isPasswordProtected,
    };
  }
}
