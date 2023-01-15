import {DbClient} from "@vitologi/local-db";
import {transactionsMigrations} from "./transactions.migrations";
import {ITransactionDto} from "../shared/dtos/transaction.dto";

const client = new DbClient({dbName: "transactions"});
const db = client.db("transactions", {client, migrations: transactionsMigrations});
db.open();

export const transactionsCollection = db.collection<ITransactionDto>("transactions");
