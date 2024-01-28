import type { Config } from "drizzle-kit";
export default ({
	schema: "./drizzle/schema.ts",
	out: "./drizzle",
	driver: "mysql2",
	dbCredentials: { uri: process.env.DATABASE_URL || "" },
} satisfies Config);
