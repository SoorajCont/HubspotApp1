import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { dropLineItem } from "@/actions/lineItems";
import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const lineItemId = req.nextUrl.searchParams.get("lineItemId");
    const portalId = req.nextUrl.searchParams.get("portalId");
    const accessToken = await getAccessTokenWithPortalId(Number(portalId));

    if (!accessToken) {
      return Response.json({ message: "Not get access token" });
    }

    const response = await dropLineItem(accessToken, Number(lineItemId));
    if (!response) {
      return Response.json({ message: "Not Deleted" });
    }
    return Response.json({ message: "success" });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
};
