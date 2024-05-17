import { GitHubProvider } from '$lib/githubProvider';
import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import * as pkg from 'mongodb-level';

const { MongodbLevel } = pkg;
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const branch = process.env.GITHUB_BRANCH || 'main';

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        repo: process.env.GITHUB_REPO as string,
        owner: process.env.GITHUB_OWNER as string,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string,
        branch,
      }),
      databaseAdapter: new MongodbLevel<string, Record<string, unknown>>({
        collectionName: `tinacms-${branch}`,
        dbName: 'tinacms',
        mongoUri: process.env.MONGODB_URI as string,
      }),
    });
