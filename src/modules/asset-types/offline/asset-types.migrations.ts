import {IDbMigration} from "@vitologi/local-db";
import mocks from './asset-types.mocks.json';

export const assetTypesMigrations: IDbMigration[] = [
  {
    async up(db): Promise<void> {
      await db.createCollection('assetTypes', {keyPath: '_id'});
      const collection = db.collection('assetTypes');

      for(const assetType of mocks) {
        await collection.insertOne(assetType);
      }

    },

    async down(db): Promise<void> {
      await db.dropCollection('assetTypes');
    }
  }
]
