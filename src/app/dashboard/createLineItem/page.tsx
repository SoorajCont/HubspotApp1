"use client";

import { getCollectionData } from "@/actions/collections";
import ReadOnlyTable from "@/components/ReadOnlyTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillingFrequency } from "@/constants";
import { cn, decodeSlug, getId, validateTerm } from "@/lib/utils";
import { createLineItemSchema } from "@/lib/validation";
import { CollectionDataType } from "@/types";
import { useEffect, useState } from "react";
import z from "zod";

const CreateLineItem = ({
  searchParams: { collection, portalId },
}: {
  searchParams: {
    portalId: string;
    dealId: string;
    collection: string;
  };
}) => {
  const [productDataTable, setProductDataTable] = useState<
    CollectionDataType[]
  >([]);

  const [inputData, setInputData] = useState<
    z.infer<typeof createLineItemSchema>
  >({
    quantity: "",
    hs_product_id: getId(decodeSlug(collection)),
    recurringbillingfrequency: "",
    hs_recurring_billing_period: "",
    billing_start_date: "",
  });

  const [isValid, setIsValid] = useState(true);

  const [filteredData, setFilteredData] = useState<CollectionDataType[]>([]);

  const getProductDataTable = async () => {
    const response: CollectionDataType[] | undefined = await getCollectionData(
      `Account_${portalId}`,
      collection
    );
    if (!response) {
      throw new Error("Product Collection Not Found");
    }
    setProductDataTable(response);
  };

  useEffect(() => {
    getProductDataTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productDataTable.length > 0) {
      const newData = productDataTable.filter(
        (item) =>
          item.quantity == inputData.quantity ||
          (item.term == inputData.hs_recurring_billing_period &&
            item.billing_frequency == inputData.recurringbillingfrequency)
      );
      setFilteredData(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData, setInputData]);

  return (
    <div className=" max-w-7xl m-auto">
      <ReadOnlyTable data={filteredData} />

      <div className="flex gap-5 w-fit">
        <Input
          type="date"
          value={inputData.billing_start_date}
          onChange={(e) =>
            setInputData({ ...inputData, billing_start_date: e.target.value })
          }
        />
        <Input
          type="text"
          placeholder="Quantity"
          onChange={(e) => {
            setInputData({ ...inputData, quantity: e.target.value });
          }}
          value={inputData.quantity}
        />
        <Input
          type="text"
          placeholder="Term(Months)"
          onChange={(e) => {
            const newData = { ...inputData };
            const result = validateTerm(
              newData.recurringbillingfrequency,
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
              parseInt(newData.hs_recurring_billing_period)
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
      </div>
    </div>
  );
};

export default CreateLineItem;
