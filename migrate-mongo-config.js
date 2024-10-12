import dotenv from 'dotenv';

dotenv.config();

const config = {
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  migrationsDir: 'migrations',
  moduleSystem: 'esm',
  mongodb: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    url: process.env.MONGODB_URI,
  },
  useFileHash: false,
};

export default config;
