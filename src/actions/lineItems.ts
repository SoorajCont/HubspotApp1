"use server";

import { LineItemsObject, LineItemsResponse } from "@/types";
import z from "zod";
import axios, { AxiosResponse } from "axios";
import { createLineItemSchema, editLineItemSchema } from "@/lib/validation";

export async function getLineItemList(accessToken: string, dealId: number) {
  try {
    const response: LineItemsResponse = await axios({
      method: "get",
      url: `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_items`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response) {
      throw new Error("No Line Item found");
    }
    return response.data.results.map((item) => item.id);
  } catch (error: any) {
    console.error({ error: error.message });
  }
}
export async function getLineItemRecords(list: string[], accessToken: string) {
  try {
    let records: LineItemsObject[] = [];
    for (const itemId of list) {
      const response: {
        data: LineItemsObject;
      } = await axios({
        method: "get",
        url: `https://api.hubapi.com/crm/v3/objects/line_items/${itemId}?properties=Name,amount,quantity,hs_discount_percentage,price,hs_product_id,hs_recurring_billing_period,hs_recurring_billing_start_date,recurringbillingfrequency,hs_billing_start_delay_days,hs_billing_start_delay_months,hs_billing_start_delay_type`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response) {
        throw new Error("No Line Item Records Found");
      }
      records.push(response.data);
    }
    return records;
  } catch (error: any) {
    console.error({ error: error.message });
  }
}

export async function dropLineItem(accessToken: string, LineItemId: Number) {
  try {
    const response = await axios.delete(
      `https://api.hubapi.com/crm/v3/objects/line_items/${LineItemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response) {
      throw new Error("Line Item Not Dropped");
    }

    return response;
  } catch (error: any) {
    console.error({ error: error.message });
  }
}

export async function createLineItem(
  accessToken: string,
  body: {
    properties: z.infer<typeof createLineItemSchema>;
  }
) {
  try {
    const response: {
      data: LineItemsObject;
    } = await axios({
      method: "post",
      url: "https://api.hubapi.com/crm/v3/objects/line_items",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: body,
    });

    if (!response.data.id) {
      throw new Error("Line Item Not Created");
    }

    return response.data.id;
  } catch (error: any) {
    console.error({ error: error.message });
  }
}

export async function editLineItem(
  accessToken: string,
  body: {
    properties: z.infer<typeof editLineItemSchema>;
  },
  lineItemId: number
) {
  try {
    const response: { data: { id: string } } = await axios({
      method: "patch",
      url: `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: body,
    });

    if (!response.data.id) {
      throw new Error("Line Item Not Edited");
    }

    return response.data.id;
  } catch (error: any) {
    console.error({ error: error.message });
  }
}
export async function associateLineToDeal(
  accessToken: string,
  dealId: string,
  LineItemId: string
) {
  try {
    console.log(LineItemId);
    const body = {
      inputs: [
        {
          from: {
            id: `${LineItemId}`,
          },
          to: {
            id: `${dealId}`,
          },
          type: "line_item_to_deal",
        },
      ],
    };

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/associations/Line_items/Deal/batch/create",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("Line Item Not Associated");
    }

    return response.data;
  } catch (error: any) {
    console.error({ error: error.message });
  }
}
