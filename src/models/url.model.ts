export interface Url {
  clicks: number;
  createdAt: number;
  destructionKey: string;
  encryptedUrl: string;
  expireAfter: number | null;
  hashedSlug: string;
  isPasswordProtected: boolean;
}

export class UrlModel {
  constructor(
    public hashedSlug: string,
    public encryptedUrl: string,
    public destructionKey: string,
    public isPasswordProtected: boolean,
    public clicks: number,
    public createdAt: number,
    public expireAfter: number | null,
  ) {}

  serialize() {
    return {
      clicks: this.clicks,
      createdAt: this.createdAt,
      destructionKey: this.destructionKey,
      encryptedUrl: this.encryptedUrl,
      expireAfter: this.expireAfter,
      hashedSlug: this.hashedSlug,
      isPasswordProtected: this.isPasswordProtected,
    };
  }

  static deserialize(data: Url) {
    return new UrlModel(
      data.hashedSlug,
      data.encryptedUrl,
      data.destructionKey,
      data.isPasswordProtected,
      data.clicks,
      data.createdAt,
      data.expireAfter,
    );
  }

  static create({
    destructionKey,
    encryptedUrl,
    expireAfter,
    hashedSlug,
    isPasswordProtected,
  }: Omit<Url, 'createdAt' | 'clicks'>) {
    return new UrlModel(
      hashedSlug,
      encryptedUrl,
      destructionKey,
      isPasswordProtected,
      0,
      Date.now(),
      expireAfter || null,
    );
  }
}
