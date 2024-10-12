import { getEnv } from './getter';

export const mongodbConfig = {
  uri: getEnv('MONGODB_URI'),
};
