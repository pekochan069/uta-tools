import { Type } from "@sinclair/typebox";
import { wrap } from "@decs/typeschema";
import { eq, sql } from "drizzle-orm";

import { publicProcedure, router } from ".";
import { db } from "~/server/db";
import { Err, None, Ok, Some, type Result, type Maybe } from "~/lib/types";
import { createId } from "~/lib/nanoid";
import { shortLink } from "../db/schema";

export const trpcRouter = router({
	checkSlug: publicProcedure.input(wrap(Type.String())).query(async ({ input }) => {
		if (input === "") {
			return Err<string, string>("Slug cannot be empty");
		}

		try {
			const res = await db.select().from(shortLink).where(eq(shortLink.slug, input));

			if (res.length > 0) {
				return Ok<string, string>(res[0].url);
			}

			return Ok<string, string>("");
		} catch (e) {
			return Err<string, string>("Cannot fetch data from database");
		}
	}),
	createLink: publicProcedure.input(wrap(Type.String())).mutation(async ({ input }) => {
		const MAX_ATTEMPTS = 10;

		try {
			const find = await db.select().from(shortLink).where(eq(shortLink.url, input));

			if (find.length > 0) {
				return Ok(find[0].slug);
			}
		} catch (e) {
			console.error(e);
			return Err(e);
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
					return Ok(slug);
				}
			} catch (e) {
				console.error(e);
			}
		}

		return Err(new Error("Cannot create short link"));
	}),
});

export type AppRouter = typeof trpcRouter;
