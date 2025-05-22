// packages/trpc/emitter.ts
import { EventEmitter } from "events";

export const txEmitter = new EventEmitter();

// Optional: increase limit to avoid warning if many clients
txEmitter.setMaxListeners(50);
