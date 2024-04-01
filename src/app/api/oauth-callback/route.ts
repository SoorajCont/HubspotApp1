import { getAccessTokenWithRefreshToken } from "@/actions/authToken";
import {
  createDatabase,
  exchangeAuthorizationCodeForTokens,
  getAccountInfo,
  saveRefreshTokenToMongo,
} from "@/actions/install";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const authorizationCode = req.nextUrl.searchParams.get("code");

  // Extract the authorization code from the query parameters
  if (authorizationCode) {
    try {
      const tokens = await exchangeAuthorizationCodeForTokens(
        authorizationCode
      );
      const refreshToken = tokens.refresh_token;
      const accessToken = await getAccessTokenWithRefreshToken(refreshToken);

      if (!accessToken) {
        throw new Error("Not get access token");
      }
      // Use the access token to make requests to the HubSpot API
      const accountInfo = await getAccountInfo(accessToken);

      // Extract organization name and ID from the accountInfo
      const portalId = accountInfo.portalId;

      await saveRefreshTokenToMongo(refreshToken, portalId);
      await createDatabase(portalId);

      return NextResponse.redirect(
        `${process.env.DOMAIN}/success?portalId=${portalId}`
      );
    } catch (error: any) {
      return NextResponse.json({ error: error.message });
    }
  }

  return NextResponse.json({ message: "No authorization code provided" });
};
