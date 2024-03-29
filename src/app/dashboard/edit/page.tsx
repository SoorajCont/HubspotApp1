"use client";

import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getLineItemList, getLineItemRecords } from "@/actions/lineItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillingFrequency } from "@/constants";
import { cn, validateTerm } from "@/lib/utils";
import axios from "axios";
import { z } from "zod";
import { useEffect, useState } from "react";
import { editLineItemSchema } from "@/lib/validation";
import toast from "react-hot-toast";

const EditPage = ({
  searchParams,
}: {
  searchParams: {
    lineItemId: string;
    hsProductId: string;
    portalId: string;
    name: string;
    dealId: string;
  };
}) => {
  const { lineItemId, hsProductId, portalId, name, dealId } = searchParams;
  const [inputData, setInputData] = useState<
    z.infer<typeof editLineItemSchema>
  >({
    name: "",
    quantity: "",
    hs_product_id: hsProductId,
    recurringbillingfrequency: "",
    hs_recurring_billing_period: "",
    hs_discount_percentage: "",
    billing_start_date: "",
  });
  const [isValid, setIsValid] = useState(true);

  const getListItems = async () => {
    try {
      const accessToken = await getAccessTokenWithPortalId(Number(portalId));
      const list = await getLineItemList(accessToken!, Number(dealId));
      const data = await getLineItemRecords(list!, accessToken!);
      const response = data!.filter((item) => item.id == lineItemId)[0]
        .properties;

      if (!response) {
        throw new Error("List Item not found");
      }
      setInputData({
        ...inputData,
        name: response.name,
        quantity: response.quantity,
        hs_recurring_billing_period: response.hs_recurring_billing_period,
        hs_discount_percentage: response.hs_discount_percentage,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListItems();
  }, []);

  const onSubmit = async () => {
    try {
      const response = await axios.patch(
        `/api/crm-card/edit?portalId=${portalId}&lineItemId=${lineItemId}`,
        {
          ...inputData,
          hs_recurring_billing_period: `P${inputData.hs_recurring_billing_period}M`,
        }
      );
      if (!response.data) {
        throw new Error("Something went wrong");
      }
      toast.success("Line Item updated successfully");
      window.location.reload();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 p-10">
      <div className="flex items-center justify-start gap-5">
        <Input
          type="date"
          placeholder="Billing Start Date"
          value={inputData.billing_start_date}
          onChange={(e) =>
            setInputData({ ...inputData, billing_start_date: e.target.value })
          }
        />
        <Input
          type="text"
          placeholder="Name"
          onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
          value={inputData.name}
        />
        <Input
          type="text"
          placeholder="Quantity"
          onChange={(e) =>
            setInputData({ ...inputData, quantity: e.target.value })
          }
          value={inputData.quantity}
        />{" "}
        <Input
          type="text"
          placeholder="Term(Months)"
          onChange={(e) => {
            const newData = { ...inputData };
            const result = validateTerm(
              newData.recurringbillingfrequency!,
              parseInt(e.target.value)
            );
            setIsValid(result);
            newData.hs_recurring_billing_period = e.target.value;
            setInputData(newData);
          }}
          value={inputData.hs_recurring_billing_period}
          className={cn(isValid ? "border-input" : "border-red-500")}
        />
        <Select
          value={inputData.recurringbillingfrequency}
          onValueChange={(e) => {
            const newData = { ...inputData };
            const result = validateTerm(
              e,
              parseInt(newData.hs_recurring_billing_period!)
            );
            setIsValid(result);
            newData.recurringbillingfrequency = e;
            setInputData(newData);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Biling Frequency" />
          </SelectTrigger>
          <SelectContent>
            {BillingFrequency.map((frequency) => (
              <SelectItem value={frequency.value} key={frequency.value}>
                {frequency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Discount Percentage"
          onChange={(e) =>
            setInputData({
              ...inputData,
              hs_discount_percentage: e.target.value,
            })
          }
          value={inputData.hs_discount_percentage}
        />
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default EditPage;
