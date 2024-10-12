import { env } from 'std-env';

export const mongodbConfig = {
  uri: env.MONGODB_URI,
};
