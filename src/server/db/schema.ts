import {
  index,
  int,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const shortLink = mysqlTable(
  "ShortLink",
  {
    id: int("id").autoincrement().notNull(),
    url: varchar("url", { length: 3000 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      slugIdx: index("ShortLink_slug_idx").on(table.slug),
      shortLinkId: primaryKey({ columns: [table.id], name: "ShortLink_id" }),
      shortLinkSlugKey: unique("ShortLink_slug_key").on(table.slug),
    };
  },
);
