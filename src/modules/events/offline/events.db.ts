import {DbClient} from "@vitologi/local-db";
import {eventsMigrations} from "./events.migrations";
import {IBaseEventDto} from "../shared/dtos/base-event.dto";

const client = new DbClient({dbName: "events"});
const db = client.db("events", {client, migrations: eventsMigrations});
db.open();

export const eventsCollection = () => db.collection<IBaseEventDto>("events");
