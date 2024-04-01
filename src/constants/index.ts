export const CLIENT_ID = process.env.CLIENT_ID!;
export const CLIENT_SECRET = process.env.CLIENT_SECRET!;
export const AUTHORIZATION_URL = process.env.NEXT_PUBLIC_AUTHORIZATION_URL!;
export const REDIRECT_URI = process.env.REDIRECT_URI!;
export const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI!;
export const DOMAIN = process.env.DOMAIN;

export const PORT = process.env.PORT || 5000;
export const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY!;
export const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID!;
export const MONGO_DB_NAME = process.env.NEXT_PUBLIC_DB_NAME!;

export const BillingFrequency: {
  value: string;
  label: string;
}[] = [
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "annually",
    label: "Annually",
  },
  {
    value: "bi-annually",
    label: "Bi-Annually",
  },
  {
    value: "every two years",
    label: "Every 2 Years",
  },
  {
    value: "quarterly",
    label: "Quarterly",
  },
  {
    value: "one-time",
    label: "One Time",
  },
  {
    value: "every three years",
    label: "Every 3 Years",
  },
  {
    value: "every four years",
    label: "Every 4 Years",
  },
  {
    value: "every five years",
    label: "Every 5 Years",
  },
];

export const BillingStartDate: {
  value: string;
  label: string;
}[] = [
  {
    value: "at payment",
    label: "At Payment",
  },
  {
    value: "custom date",
    label: "Custom Date",
  },
  {
    value: "delayed start (months)",
    label: "Delayed Start (Months)",
  },
];
