import {DbClient} from "@vitologi/local-db";
import {assetTypesMigrations} from "./asset-types.migrations";
import {IAssetTypeDto} from "../shared/interfaces/asset-type.dto";

const client = new DbClient({dbName: "assetTypes"});
const db = client.db("assetTypes", {client, migrations: assetTypesMigrations});
db.open();

export const assetTypesCollection = () => db.collection<IAssetTypeDto>("assetTypes");
