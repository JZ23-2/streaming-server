import { HttpAgent, Actor } from "@dfinity/agent";
import { createActor } from "../declarations/backend/index.js";
import { Principal } from "@dfinity/principal";

export async function getUserByStreamingKey(streamingKey) {
  try {
    const actor = createActor(process.env.CANISTER_ID, {
      agentOptions: {
        host: process.env.REPLICA_URL,
        shouldFetchRootKey: true,
      },
    });

    const response = await actor.getUserByStreamingKey(streamingKey);
    return response;
  } catch (error) {
    // if (error instanceof TransportError) {
      console.log(error);
    // }
    // console.log("error occurredddada", error);
  }
}

export async function getAllFollowers(principalId) {
  try {
    const actor = createActor(process.env.CANISTER_ID, {
      agentOptions: {
        host: process.env.REPLICA_URL,
        shouldFetchRootKey: true,
      },
    });

    const response = await actor.getAllFollowers(principalId);
    return response;
  } catch (error) {
    // if (error instanceof TransportError) {
      console.log(error);
    // }
    // console.log("error occurredddada", error);
  }

}