import {IDbMigration} from "@vitologi/local-db";
import mocks from './portfolios.mocks.json';

export const portfoliosMigrations: IDbMigration[] = [
  {
    async up(db): Promise<void> {
      await db.createCollection('portfolios', {keyPath: '_id'});
      const collection = db.collection('portfolios');

      for(const item of mocks) {
        await collection.insertOne(item);
      }

    },

    async down(db): Promise<void> {
      await db.dropCollection('portfolios');
    }
  }
]
