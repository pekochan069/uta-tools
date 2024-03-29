import { wrap } from "@decs/typeschema";
import { Type } from "@sinclair/typebox";
import { eq, sql } from "drizzle-orm";

import { createId } from "~/lib/nanoid";
import { Err, Ok } from "~/lib/types";
import { db } from "~/server/db";
import { shortLink } from "~/server/db/schema";
import { publicProcedure, router } from ".";

export const trpcRouter = router({
  checkSlug: publicProcedure
    .input(wrap(Type.String()))
    .query(async ({ input }) => {
      if (input === "") {
        return Err<string, string>("Slug cannot be empty");
      }

      try {
        const res = await db
          .select()
          .from(shortLink)
          .where(eq(shortLink.slug, input));

        if (res.length > 0) {
          return Ok<string, string>(res[0].url);
        }

        return Ok<string, string>("");
      } catch (e) {
        return Err<string, string>("Cannot fetch data from database");
      }
    }),
  createLink: publicProcedure
    .input(wrap(Type.String()))
    .mutation(async ({ input }) => {
      const MAX_ATTEMPTS = 10;

      try {
        const find = await db
          .select()
          .from(shortLink)
          .where(eq(shortLink.url, input));

        if (find.length > 0) {
          return Ok<string, Error>(find[0].slug);
        }
      } catch (e) {
        console.error(e);
        return Err<string, Error>(new Error("Cannot fetch data from database"));
      }

      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        try {
          const slug = createId();

          const res = await db
            .insert(shortLink)
            .values({
              url: input,
              slug: slug,
            })
            .onDuplicateKeyUpdate({ set: { id: sql`id` } });

          if (res.insertId !== "0") {
            return Ok<string, Error>(slug);
          }
        } catch (e) {
          console.error(e);
        }
      }

      return Err<string, Error>(new Error("Cannot create short link"));
    }),
});

export type AppRouter = typeof trpcRouter;
