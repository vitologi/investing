import {DbClient} from "@vitologi/local-db";
import {portfoliosMigrations} from "./portfolios.migrations";
import {IPortfolioDto} from "../shared/dtos/portfolio.dto";

const client = new DbClient({dbName: "portfolios"});
const db = client.db("portfolios", {client, migrations: portfoliosMigrations});
db.open();

export const portfoliosCollection = () => db.collection<IPortfolioDto>("portfolios");
