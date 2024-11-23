import { connect } from "@tidbcloud/serverless";
import { drizzle } from "drizzle-orm/tidb-serverless";
import { env } from "~/env";
import * as schema from "./schema";

const client = connect({ url: env.DATABASE_URL });
export const db = drizzle(client, { schema });
