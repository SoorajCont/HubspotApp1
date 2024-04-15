"use server";
import { decodeSlug, generateSlug, getId } from "@/lib/utils";
import { CollectionType } from "@/types";
import axios from "axios";
import { Db } from "mongodb";
import { getAccessTokenWithPortalId } from "./authToken";
import { getCollectionList } from "./collections";

export async function getProduct(productId: string, accessToken: string) {
  const getLineItems = `https://api.hubapi.com/crm/v3/objects/products/${productId}`;
  try {
    const response = await axios.get(getLineItems, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Data", response.data);

    return response.data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function createProductCollection(
  dbClient: Db,
  objectId: string,
  portalId: number
) {
  try {
    const accessToken: string | null = await getAccessTokenWithPortalId(
      portalId
    );

    if (!accessToken) {
      throw new Error("Not get access token");
    }

    const product = await getProduct(objectId, accessToken);
    if (!product) {
      throw new Error("Not get product");
    }
    await dbClient.createCollection(
      generateSlug(`${product.properties.name}_${objectId}`)
    );

    return true;
  } catch (err: any) {
    console.error({ error: err.message });
  }
}

export async function dropCollectionWebhook(
  dbClient: Db,
  objectId: number,
  portalId: number
) {
  // Create a new MongoClient
  try {
    const collections = await getCollectionList(`Account_${portalId}`);

    if (!collections) {
      throw new Error("Not get collection");
    }

    const collection: CollectionType[] = collections.filter(
      (collection) => Number(getId(decodeSlug(collection.name))) === objectId
    );

    if (!collection) {
      throw new Error("Not get collection");
    }

    const response = await dbClient.collection(collection[0].name).drop();

    if (!response) {
      throw new Error("Not drop collection");
    }

    return true;
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
  }
}
