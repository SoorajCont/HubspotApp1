"use server";

import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/constants";
import { createMongoConnection } from "./dbConnetion";
import axios from "axios";
import { Db, MongoClient } from "mongodb";

export async function createDatabase(portalId: number) {
  const dbName = `Account_${portalId}`;
  try {
    const dbClient: MongoClient | undefined = await createMongoConnection();
    const db: Db | undefined = dbClient?.db(dbName);
    dbClient?.close();
    if (!db) {
      throw new Error("Database not created");
    }
    return true;
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
  }
}

export async function saveRefreshTokenToMongo(
  refreshToken: string,
  portalId: number
) {
  try {
    const docToInsert = { account: portalId, refresh: refreshToken };
    const collectionName = "RefreshTokens";
    const dbClient = await createMongoConnection();
    const db = dbClient?.db("Token_Database");
    const collection = db?.collection(collectionName);
    const data = await collection?.findOne({ account: portalId });
    if (data) {
      await collection?.updateOne(
        { account: portalId },
        { $set: { refresh: refreshToken } },
        { upsert: true }
      );
      dbClient?.close();
      return true;
    } else {
      await collection?.insertOne(docToInsert);
      dbClient?.close();
      return true;
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
  }
}

export async function exchangeAuthorizationCodeForTokens(
  authorizationCode: string
) {
  // Use the authorization code to obtain the access and refresh tokens
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code", authorizationCode);
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.hubapi.com/oauth/v1/token",
      headers: {
        Accept: "Application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: params,
    });
    return response.data;
  } catch (error: any) {
    console.error({
      error: error.message,
    });
  }
}

export async function getAccountInfo(accessToken: string) {
  try {
    const response = await axios.get(
      "https://api.hubapi.com/integrations/v1/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error({
      messgae: "Error Getting Account Info",
      error: error.message,
    });
  }
}

export const getProducts = (accessToken:string) => {
  try {
    const products = axios.get("https://api.hubapi.com/crm/v3/objects/products", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    return products
  } catch (error) {
    console.error({error})
  }
}