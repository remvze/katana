export interface UrlDTO {
  clicks: number;
  createdAt: Date;
  destructionKey: string;
  encryptedUrl: string;
  hashedSlug: string;
  id: string;
  isDeleted: boolean;
  isPasswordProtected: boolean;
  updatedAt: Date;
}

export interface CreateUrlDTO {
  destructionKey: string;
  encryptedUrl: string;
  hashedSlug: string;
  isPasswordProtected: boolean;
}

export interface UpdateUrlDTO {
  clicks?: number;
  destructionKey?: string;
  encryptedUrl?: string;
  hashedSlug?: string;
  isDeleted?: boolean;
  isPasswordProtected?: boolean;
}
