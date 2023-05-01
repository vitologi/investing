import {DbClient} from "@vitologi/local-db";
import {currenciesMigrations} from "./currencies.migrations";
import {ICurrencyRateDto} from "../shared/dtos/currency-rate.dto";

const client = new DbClient({dbName: "currencies"});
const db = client.db("currencies", {client, migrations: currenciesMigrations});
db.open();

export const currencyRatesCollection = () => db.collection<ICurrencyRateDto>("currencyRates");
