import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const shortLinks = mysqlTable("short_link", {
  id: int("id").primaryKey().autoincrement(),
  url: varchar("url", { length: 750 }).unique(),
  slug: varchar("slug", { length: 16 }).unique(),
});

export type ShortLink = typeof shortLinks.$inferSelect;
export type ShortLinkInsert = typeof shortLinks.$inferInsert;
