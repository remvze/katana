import type { Types } from 'mongoose';

interface Document {
  _id: Types.ObjectId;
}

export function normalizeId<T extends Document>(doc: T) {
  const { _id, ...rest } = doc;

  return { ...rest, id: _id.toString() };
}
