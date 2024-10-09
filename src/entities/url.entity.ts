export class UrlEntity {
  public id: string;
  public clicks: number;
  public createdAt: Date;
  public destructionKey: string;
  public encryptedUrl: string;
  public hashedSlug: string;
  public isDeleted: boolean;
  public isPasswordProtected: boolean;
  public updatedAt: Date;

  constructor({
    clicks = 0,
    createdAt = new Date(),
    destructionKey,
    encryptedUrl,
    hashedSlug,
    id = '',
    isDeleted = false,
    isPasswordProtected = false,
    updatedAt = new Date(),
  }: Partial<UrlEntity>) {
    this.id = id;
    this.clicks = clicks;
    this.createdAt = createdAt;
    this.destructionKey = destructionKey!;
    this.encryptedUrl = encryptedUrl!;
    this.hashedSlug = hashedSlug!;
    this.isDeleted = isDeleted;
    this.isPasswordProtected = isPasswordProtected;
    this.updatedAt = updatedAt;
  }

  incrementClick(): void {
    this.clicks += 1;
  }

  markAsDeleted(): void {
    this.isDeleted = true;
    this.encryptedUrl = '[DELETED]';
  }

  isActive(): boolean {
    return !this.isDeleted;
  }
}
