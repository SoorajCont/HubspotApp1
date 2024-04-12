"use server";

import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/constants/";

import axios from "axios";
import colors from "colors/safe";
import { createMongoConnection } from "./dbConnetion";
import { Db, MongoClient, WithId } from "mongodb";
import { AxiosResponse } from "axios";

interface RefreshToken extends WithId<Document> {
  account: Number;
  refresh: string;
}

interface AccessToken extends AxiosResponse {
  data: {
    access_token: string;
  };
}

let cacheAccessToken: string | null;
const clearData = () => {
  cacheAccessToken = null;
};

setTimeout(clearData, 28 * 60 * 1000);

export async function getAccessTokenWithPortalId(portalId: Number) {
  // Use the authorization code to obtain the access and refresh tokens
  if (!cacheAccessToken) {
    try {
      const dbClient: MongoClient | undefined = await createMongoConnection();
      const db: Db | undefined = dbClient?.db("Token_Database");
      const collection = db?.collection("RefreshTokens");
      const data: RefreshToken = (await collection?.findOne({
        account: portalId,
      })) as RefreshToken;

      if (!data) {
        throw new Error("No Refresh Token Found");
      }

      const accessToken = await getAccessTokenWithRefreshToken(data.refresh);

      if (!accessToken) {
        throw new Error("Access Token Not Generated");
      }

      cacheAccessToken = accessToken;

      dbClient?.close();
      return accessToken;
    } catch (error: any) {
      console.error({
        error: colors.red(error.message),
      });
    }
  }

  return cacheAccessToken;
}

export async function getAccessTokenWithRefreshToken(refreshToken: string) {
  if (!cacheAccessToken) {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("client_id", CLIENT_ID);
      params.append("client_secret", CLIENT_SECRET);
      params.append("redirect_uri", REDIRECT_URI);
      params.append("refresh_token", refreshToken);

      const response: AccessToken = await axios({
        method: "POST",
        url: "https://api.hubapi.com/oauth/v1/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        data: params,
      });

      if (!response) {
        throw new Error("Access Token Not Generated");
      }

      cacheAccessToken = response.data.access_token;

      return response.data.access_token;
    } catch (error: any) {
      console.error({
        error: colors.red(error.message),
      });
    }
  }

  return cacheAccessToken;
}
