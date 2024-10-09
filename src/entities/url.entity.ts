interface Entity {
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

export class UrlEntity implements Entity {
  public id!: string;
  public clicks!: number;
  public createdAt!: Date;
  public destructionKey!: string;
  public encryptedUrl!: string;
  public hashedSlug!: string;
  public isDeleted!: boolean;
  public isPasswordProtected!: boolean;
  public updatedAt!: Date;

  constructor(entity: Entity) {
    Object.assign(this, entity);
  }

  incrementClick(): void {
    this.clicks++;
  }

  markAsDeleted(): void {
    this.isDeleted = true;
    this.encryptedUrl = '[DELETED]';
  }

  isActive(): boolean {
    return !this.isDeleted;
  }
}
