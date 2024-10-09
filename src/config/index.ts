import { turnstileConfig } from './turnstile';
import { mongodbConfig } from './mongodb';
import { otherConfig } from './other';

export const config = {
  mongodb: mongodbConfig,
  other: otherConfig,
  turnstile: turnstileConfig,
};
