import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { associateLineToDeal, createLineItem } from "@/actions/lineItems";

import { createLineItemSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const dealId = req.nextUrl.searchParams.get("dealId");
    const portalId = req.nextUrl.searchParams.get("portalId");
    const validatedSchema = createLineItemSchema.safeParse(body);

    if (!validatedSchema.success) {
      return Response.json({ message: "" });
    }

    const {
      hs_product_id,
      hs_recurring_billing_period,
      quantity,
      recurringbillingfrequency,
      billing_start_date,
    } = validatedSchema.data;

    const newBody = {
      properties: {
        quantity,
        hs_product_id,
        recurringbillingfrequency,
        hs_recurring_billing_period: `P${hs_recurring_billing_period}M`,
        billing_start_date,
      },
    };

    const accessToken = await getAccessTokenWithPortalId(Number(portalId));

    if (!accessToken) {
      return Response.json({ message: "Access Token Not Generated" });
    }

    const lineItemId = await createLineItem(accessToken, newBody);
    if (!lineItemId) {
      return Response.json({ message: "error" });
    }

    const response = await associateLineToDeal(
      accessToken,
      dealId!,
      lineItemId
    );

    if (!response) {
      return Response.json({ message: "error" });
    }

    return Response.json({ message: "success" });
  } catch (error: any) {
    console.log(error);
    return Response.json({ message: error.message });
  }
};
