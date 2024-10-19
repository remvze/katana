import { getEnv } from './getter';

export const deploymentConfig = {
  runtime: getEnv('DEPLOYMENT_RUNTIME'),
};
