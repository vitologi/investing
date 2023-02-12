import {IDbMigration} from "@vitologi/local-db";

export const currenciesMigrations: IDbMigration[] = [
  {
    async up(db): Promise<void> {
      await db.createCollection('currencyRates', {keyPath: '_id'});
    },

    async down(db): Promise<void> {
      await db.dropCollection('currencyRates');
    }
  }
]
