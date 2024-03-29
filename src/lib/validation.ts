import z from "zod";

export const createLineItemSchema = z.object({
  quantity: z.string(),
  hs_product_id: z.string(),
  recurringbillingfrequency: z.string(),
  hs_recurring_billing_period: z.string(),
  billing_start_date: z.string(),
});

export const editLineItemSchema = z.object({
  quantity: z.string().optional(),
  hs_product_id: z.string().optional(),
  recurringbillingfrequency: z.string().optional(),
  hs_recurring_billing_period: z.string().optional(),
  billing_start_date: z.string().optional(),
  name: z.string().optional(),
  hs_discount_percentage: z.string().optional(),
});
