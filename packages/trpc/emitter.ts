import { EventEmitter } from "events";

export const txEmitter = new EventEmitter();

// Increase limit to avoid warning if many clients
txEmitter.setMaxListeners(50);
