import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { createContext } from "~/server/trpc/context";

import { trpcRouter } from "~/server/trpc/router";

export const ALL: APIRoute = ({ request }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: trpcRouter,
    createContext: createContext,
  });
};
