"use server";

import {
  CollectionDataResponse,
  CollectionDataType,
  CollectionTypeResponse,
} from "@/types";
import { Collection, CollectionInfo, Db, Document, MongoClient } from "mongodb";
import { createMongoConnection } from "./dbConnetion";

// Connection URI //Account_portalId
export async function getCollectionList(databaseName: string) {
  // Create a new MongoClient
  try {
    const dbClient: MongoClient | undefined = await createMongoConnection();

    if (!dbClient) {
      throw new Error("Not able to get DB Client");
    }

    const db = dbClient.db(databaseName);
    const collections: (CollectionInfo | CollectionTypeResponse)[] = await db
      .listCollections()
      .toArray();

    if (!collections) {
      throw new Error("Not able to get Collection List");
    }

    const documents = collections.map((collection) => {
      return {
        name: collection.name,
        uuid: collection.info!.uuid!.toString(),
      };
    });
    dbClient.close();
    return documents;
  } catch (error: any) {
    console.log({
      error: error.message,
    });
  }
}

export async function getCollectionData(
  databaseName: string,
  selectedCollection: string
) {
  // Create a new MongoClient
  const dbClient: MongoClient | undefined = await createMongoConnection();
  try {
    const db: Db | undefined = dbClient?.db(databaseName);
    let query = {};

    const collections: Collection<Document> | undefined =
      db?.collection(selectedCollection);

    const documents: CollectionDataResponse[] | undefined = (await collections
      ?.find(query)
      .toArray()) as CollectionDataResponse[];

    const data = documents?.map((document) => {
      return {
        // _id: document._id.toString(),
        billing_start_date: document.billing_start_date,
        term: document.term,
        billing_frequency: document.billing_frequency,
        quantity: document.quantity,
        discount: document.discount,
      };
    });

    dbClient?.close();
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
}

// async function updateCollection(databaseName:string, selectedCollection:string, collection:string) {
//   // Create a new MongoClient
//   const client = await createMongoConnection();
//   const dbo = client.db(databaseName);
//   await dbo.collection(selectedCollection).updateMany(collection);
//   console.log("Collection:");
//   documents.forEach((document) => {
//     console.log("Columns:", document.columnsName);
//     console.log("Rows:", document.rows);
//   });
//   client.close();
// }

export async function insertCollectionData(
  dbName: string,
  selectedCollection: string,
  data: CollectionDataType[]
) {
  try {
    const client: MongoClient | undefined = await createMongoConnection();
    const dbo: Db | undefined = client?.db(dbName);
    await dbo?.collection(selectedCollection).drop();
    const result = await dbo?.collection(selectedCollection).insertMany(data);

    if (!result) {
      throw new Error("Not able to insert data");
    }
    return true;
  } catch (error) {
    console.log(error);
  }
}

export const dropCollection = async (
  dbName: string,
  collectionName: string
) => {
  try {
    const client: MongoClient | undefined = await createMongoConnection();
    const dbo: Db | undefined = client?.db(dbName);
    const response = await dbo?.collection(collectionName).drop();
    if (!response) {
      throw new Error("Not able to drop collection");
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

export async function renameCollection(
  databaseName: string,
  selectedCollection: string,
  newName: string
) {
  try {
    const client: MongoClient | undefined = await createMongoConnection();
    const dbo: Db | undefined = client?.db(databaseName);
    await dbo?.collection(selectedCollection).rename(newName);
    client?.close();
  } catch (error: any) {
    console.error({ error: error.message });
  }
}
