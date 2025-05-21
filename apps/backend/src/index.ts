import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "trpc/router";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/trpc/*", trpcServer({ router: appRouter }));

serve({ fetch: app.fetch, port: 3001 });
console.log("🚀 Backend running at http://localhost:3001");
