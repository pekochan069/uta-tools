import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "~/server/trpc/router";

export const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
});
