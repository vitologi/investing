import {IDbMigration} from "@vitologi/local-db";

// TODO: need to use enum values
export const eventsMigrations: IDbMigration[] = [
  {
    async up(db): Promise<void> {
      await db.createCollection('events', {keyPath: '_id'});
    },

    async down(db): Promise<void> {
      await db.dropCollection('events');
    }
  }
]
