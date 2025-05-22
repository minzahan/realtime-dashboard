// apps/backend/src/ws-server.ts

import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter, AppRouter } from "trpc/router";
import { createContext } from "trpc/context";

const wss = new WebSocketServer({
  port: 3002, // 🚨 avoid 3001 since your HTTP server is likely on it
});

const handler = applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext: () => createContext(), // Must match the context type
});

wss.on("connection", (ws) => {
  console.log(`➕ Client connected (${wss.clients.size})`);

  ws.once("close", () => {
    console.log(`➖ Client disconnected (${wss.clients.size})`);
  });
});

console.log("📡 tRPC WebSocket Server listening on ws://localhost:3002");

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM: shutting down WebSocket server...");
  handler.broadcastReconnectNotification();
  wss.close();
});
