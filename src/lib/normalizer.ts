import type { Document, Types } from 'mongoose';

interface SimpleDocument extends Document {
  _id: Types.ObjectId;
}

export function normalizeId(doc: SimpleDocument) {
  const { _id, ...rest } = doc;

  return { ...rest, id: _id.toString() };
}
