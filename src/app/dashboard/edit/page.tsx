"use client";

import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getLineItemList, getLineItemRecords } from "@/actions/lineItems";
import BillingStartDateEdit from "@/components/BillingStartDateEdit";
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
import { cn, removeFirstAndLastLetter, validateTerm } from "@/lib/utils";
import { editLineItemSchema } from "@/lib/validation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

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
    hs_recurring_billing_start_date: "",
    hs_billing_start_delay_days: "",
    hs_billing_start_delay_months: "",
    hs_billing_start_delay_type: "",
  });
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const getListItems = async () => {
    try {
      const accessToken = await getAccessTokenWithPortalId(Number(portalId));
      const list = await getLineItemList(accessToken!, Number(dealId));
      const data = await getLineItemRecords(list!, accessToken!);
      console.log(data);
      const response = data!.filter((item) => item.id == lineItemId)[0]
        .properties;
      // console.log(response);

      if (!response) {
        throw new Error("List Item not found");
      }

      setInputData({
        ...inputData,
        name: response.name,
        quantity: response.quantity,
        hs_recurring_billing_period: removeFirstAndLastLetter(
          response.hs_recurring_billing_period
        ),
        hs_discount_percentage: response.hs_discount_percentage,
        hs_recurring_billing_start_date:
          response.hs_recurring_billing_start_date,
        recurringbillingfrequency: response.recurringbillingfrequency,
        hs_billing_start_delay_days: response.hs_billing_start_delay_days,
        hs_billing_start_delay_months: response.hs_billing_start_delay_months,
        hs_billing_start_delay_type: response.hs_billing_start_delay_type,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 p-10">
      <div className="grid grid-cols-4 gap-5">
        <BillingStartDateEdit
          inputData={inputData}
          setInputData={setInputData}
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
          <SelectContent className="h-44">
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
      <Button onClick={onSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
};

export default EditPage;
