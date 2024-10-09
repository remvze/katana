import type { Document } from 'mongoose';

export function normalizeId(doc: Document) {
  const { _id, ...rest } = doc.toObject();

  return { ...rest, id: _id.toString() };
}
