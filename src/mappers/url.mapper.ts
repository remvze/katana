import removeUndefinedObjects from 'remove-undefined-objects';

import type { UrlDTO, CreateUrlDTO, UpdateUrlDTO } from '@/dtos/url.dto';
import type { UrlDocument } from '@/models/url.model';

export function toUrlDTO(document: UrlDocument): UrlDTO {
  const dto: UrlDTO = {
    clicks: document.clicks,
    createdAt: document.createdAt,
    destructionKey: document.destruction_key,
    encryptedUrl: document.encrypted_url,
    hashedSlug: document.hashed_slug,
    id: document._id.toString(),
    isDeleted: document.is_deleted,
    isPasswordProtected: document.is_password_protected,
    updatedAt: document.updatedAt,
  };

  return dto;
}

export function fromCreateUrlDTO(
  createUrlDTO: CreateUrlDTO,
): Partial<UrlDocument> {
  const document: Partial<UrlDocument> = {
    destruction_key: createUrlDTO.destructionKey,
    encrypted_url: createUrlDTO.encryptedUrl,
    hashed_slug: createUrlDTO.hashedSlug,
    is_password_protected: createUrlDTO.isPasswordProtected,
  };

  return document;
}

export function fromUpdateUrlDTO(
  updateUrlDTO: UpdateUrlDTO,
): Partial<UrlDocument> {
  const document: Partial<UrlDocument> = {
    clicks: updateUrlDTO.clicks,
    destruction_key: updateUrlDTO.destructionKey,
    encrypted_url: updateUrlDTO.encryptedUrl,
    hashed_slug: updateUrlDTO.hashedSlug,
    is_deleted: updateUrlDTO.isDeleted,
    is_password_protected: updateUrlDTO.isPasswordProtected,
  };

  return removeUndefinedObjects(document) || {};
}
