import { wrap } from "@decs/typeschema";
import { Type } from "@sinclair/typebox";
import { eq, sql } from "drizzle-orm";
import { createId } from "~/lib/nanoid";
import { Err, Ok } from "~/lib/types";
import { db } from "~/server/db";
import { shortLinks } from "~/server/db/schema";
import { publicProcedure, router } from ".";

async function checkUrl(url: string) {
  const res = await db.query.shortLinks.findFirst({
    where: (links, { eq }) => eq(links.url, url),
  });

  return res;
}

async function insertUrl(url: string) {
  let i = 0;

  do {
    i += 1;

    const slug = createId();

    const res = await db.query.shortLinks.findFirst({
      where: (links, { eq }) => eq(links.slug, slug),
    });

    if (res === undefined) {
      continue;
    }

    await db.insert(shortLinks).values({
      url,
      slug,
    });

    return slug;
  } while (i < 10);

  throw new Error("Cannot create short link");
}

export const trpcRouter = router({
  checkSlug: publicProcedure.input(wrap(Type.String())).query(async ({ input }) => {
    if (input === "") {
      return Err("Slug cannot be empty");
    }

    try {
      const res = await db.select().from(shortLinks).where(eq(shortLinks.slug, input));

      if (res.length > 0) {
        return Ok(res[0].url);
      }

      return Ok("");
    } catch (e) {
      return Err("Cannot fetch data from database");
    }
  }),
  createUrl: publicProcedure.input(wrap(Type.String())).mutation(async ({ input }) => {
    if (input === "") {
      return Err<string, Error>(new Error("URL cannot be empty"));
    }

    try {
      new URL(input);
    } catch (e) {
      return Err<string, Error>(new Error("Invalid URL"));
    }

    const processed = input.at(input.length) === "/" ? input.substring(0, input.length - 1) : input;

    const checked = await checkUrl(processed);

    if (checked !== undefined) {
      return Ok<string, Error>(checked.slug!);
    }

    return Ok<string, Error>(await insertUrl(processed));
  }),
});

export type AppRouter = typeof trpcRouter;
