import { createMongoConnection } from "@/actions/dbConnetion";
import {
  createProductCollection,
  dropCollectionWebhook,
} from "@/actions/webhook";
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const dbClient: MongoClient | undefined = await createMongoConnection();
    const data = await req.json();
    const { objectId, portalId, subscriptionType } = data[0];
    const dbName = `Account_${portalId}`;
    const db = dbClient?.db(dbName);

    if (!db) {
      return Response.json({ message: "Not Connected" });
    }

    if (subscriptionType === "product.creation") {
      const response = await createProductCollection(
        db,
        objectId,
        Number(portalId)
      );
      if (!response) {
        return Response.json({ message: "Not Created" });
      }
    } else if (subscriptionType === "product.deletion") {
      const response = await dropCollectionWebhook(
        db,
        Number(objectId),
        Number(portalId)
      );
      if (!response) {
        return Response.json({ message: "Not Deleted" });
      }
    }

    dbClient?.close();
    return Response.json({ message: "success" });
  } catch (e: any) {
    return Response.json({ message: e.message });
  }
};
