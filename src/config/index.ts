import { turnstileConfig } from './turnstile';
import { mongodbConfig } from './mongodb';
import { otherConfig } from './other';
import { deploymentConfig } from './deployment';
import { redisConfig } from './redis';

export const config = {
  deployment: deploymentConfig,
  mongodb: mongodbConfig,
  other: otherConfig,
  redis: redisConfig,
  turnstile: turnstileConfig,
};
