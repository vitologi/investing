import {IDbMigration} from "@vitologi/local-db";

export const transactionsMigrations: IDbMigration[] = [
  {
    async up(db): Promise<void> {
      await db.createCollection('transactions', {keyPath: '_id'});
    },

    async down(db): Promise<void> {
      await db.dropCollection('transactions');
    }
  }
]
