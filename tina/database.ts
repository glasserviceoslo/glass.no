import { GitHubProvider } from '$lib/tina.githubProvider';
import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import mongoLvl from 'mongodb-level';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const branch = process.env.GITHUB_BRANCH || 'main';

export default !isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        repo: process.env.GITHUB_REPO as string,
        owner: process.env.GITHUB_OWNER as string,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string,
        branch,
      }),
      databaseAdapter: new mongoLvl.MongodbLevel<string, Record<string, unknown>>({
        collectionName: `tinacms-${branch}`,
        dbName: 'tinacms',
        mongoUri: process.env.MONGODB_URI as string,
      }),
    });
