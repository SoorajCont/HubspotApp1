"use server";

import { MONGO_URI } from "@/constants";
import { MongoClient } from "mongodb";

export async function createMongoConnection() {
  try {
    const client: MongoClient = new MongoClient(MONGO_URI);
    if (!client) {
      throw new Error("MongoDB Connection Error");
    }
    await client.connect();
    return client;
  } catch (err: any) {
    console.error({
      error: err.message,
    });
  }
}
