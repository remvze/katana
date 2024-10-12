export const up = async db => {
  await db.collection('urls').createIndex({ hashedSlug: 1 }, { unique: true });

  await db
    .collection('urls')
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
};

export const down = async db => {
  await db.collection('urls').dropIndex('hashedSlug_1');
  await db.collection('urls').dropIndex('expiresAt_1');
};
