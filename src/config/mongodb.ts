import { getEnvSource } from './env';

const env = getEnvSource();

export const mongodbConfig = {
  uri: env.MONGODB_URI,
};
