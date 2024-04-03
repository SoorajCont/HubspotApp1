import BillingStartDate from "@/components/form/BillingStartDate";
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
import { LineItem } from "@/lib/validation";
import { Dispatch, SetStateAction, useState } from "react";

import { Label } from "@/components/ui/label";

interface Props {
  inputData: LineItem;
  setInputData: Dispatch<SetStateAction<LineItem>>;
  action: "Create" | "Edit";
}

const LineItemForm = ({ inputData, setInputData, action }: Props) => {
  const [isValid, setIsValid] = useState(true);
  return (
    <div className="flex gap-5 w-full">
      <BillingStartDate inputData={inputData} setInputData={setInputData} />
      {action === "Edit" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>

          <Input
            type="text"
            placeholder="Name"
            id="name"
            onChange={(e) =>
              setInputData({ ...inputData, name: e.target.value })
            }
            value={inputData.name}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          type="text"
          placeholder="Quantity"
          id="quantity"
          onChange={(e) =>
            setInputData({ ...inputData, quantity: e.target.value })
          }
          value={inputData.quantity}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="term">Term(Months)</Label>
        <Input
          type="text"
          placeholder="Term(Months)"
          id="term"
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
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="billingFrequency">Billing Frequency</Label>
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
          <SelectTrigger id="billingFrequency" className="w-[200px]">
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
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="text"
          placeholder="Discount"
          id="discount"
          onChange={(e) =>
            setInputData({
              ...inputData,
              hs_discount_percentage: e.target.value,
            })
          }
          value={inputData.hs_discount_percentage}
        />
      </div>
    </div>
  );
};

export default LineItemForm;
