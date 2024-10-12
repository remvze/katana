export const up = async db => {
  await db
    .collection('secrets')
    .createIndex({ hashedPublicId: 1 }, { unique: true });

  await db
    .collection('secrets')
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
};

export const down = async db => {
  await db.collection('secrets').dropIndex('hashedPublicId_1');
  await db.collection('secrets').dropIndex('expiresAt_1');
};
