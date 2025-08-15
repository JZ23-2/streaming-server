import crypto from "crypto";
import { getUserByStreamingKey } from "./userService.js";

const streamKeysDB = new Map();

export function createStreamKey(email) {
  const streamKey = crypto.randomBytes(8).toString("hex");
  streamKeysDB.set(streamKey, { email });
  return { streamKey, email };
}

export async function validateStreamKey(key) {
  console.log(key);
  const response = await getUserByStreamingKey(key);
  console.log(response);
}

export function getStreamKeyInfo(key) {
  return streamKeysDB.get(key);
}

