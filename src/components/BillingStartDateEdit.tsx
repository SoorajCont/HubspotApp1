import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editLineItemSchema } from "@/lib/validation";
import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
  inputData: z.infer<typeof editLineItemSchema>;
  setInputData: Dispatch<SetStateAction<z.infer<typeof editLineItemSchema>>>;
}

const BillingStartDateEdit = ({ inputData, setInputData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState({
    "custom date": false,
    "delayed start (months)": false,
    "delayed start (days)": false,
  });
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [startBillingTerm, setStartBillingTerm] = useState<string>("");
  const handleChange = (e: string) => {
    if (e === "custom date") {
      setInputData({
        ...inputData,
        hs_recurring_billing_start_date: "",
        hs_billing_start_delay_months: "",
        hs_billing_start_delay_days: "",
        hs_billing_start_delay_type: "",
      });
      setIsModalOpen({
        ...isModalOpen,
        "custom date": true,
      });
    } else if (e === "at payment") {
      setInputData({
        ...inputData,
        hs_recurring_billing_start_date: "At Payment",
        hs_billing_start_delay_months: "",
        hs_billing_start_delay_days: "",
        hs_billing_start_delay_type: "",
      });
    } else if (e === "delayed start (months)") {
      setInputData({
        ...inputData,
        hs_recurring_billing_start_date: "",
        hs_billing_start_delay_months: "",
        hs_billing_start_delay_days: "",
        hs_billing_start_delay_type: "",
      });
      setIsModalOpen({
        ...isModalOpen,
        "delayed start (months)": true,
      });
    } else if (e === "delayed start (days)") {
      setInputData({
        ...inputData,
        hs_recurring_billing_start_date: "",
        hs_billing_start_delay_months: "",
        hs_billing_start_delay_days: "",
        hs_billing_start_delay_type: "",
      });
      setIsModalOpen({
        ...isModalOpen,
        "delayed start (days)": true,
      });
    }
    setStartBillingTerm(e);
  };
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="hs_recurring_billing_start_date">
        Billing Start Date
      </Label>
      <div className="relative">
        <Button
          className="relative w-full z-10 py-0"
          onClick={() => {
            setIsSelectOpen(true);
          }}
          variant={"outline"}
          id="hs_recurring_billing_start_date"
        >
          {inputData.hs_billing_start_delay_days ? (
            <p>{`${inputData.hs_billing_start_delay_days} days after payment`}</p>
          ) : inputData.hs_billing_start_delay_months ? (
            <p>{`${inputData.hs_billing_start_delay_months} months after payment`}</p>
          ) : (
            <p>{inputData.hs_recurring_billing_start_date}</p>
          )}
        </Button>
        <Select
          value={startBillingTerm}
          onValueChange={(e) => {
            handleChange(e);
          }}
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
        >
          <SelectTrigger className="absolute top-0 left-0 -z-2">
            <SelectValue placeholder="Billing Start Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom date">
              <Dialog
                open={isModalOpen["custom date"]}
                onOpenChange={(e) =>
                  setIsModalOpen({ ...isModalOpen, "custom date": e })
                }
              >
                <DialogTrigger>Custom Date</DialogTrigger>
                <DialogContent>
                  <Input
                    type="date"
                    value={inputData.hs_recurring_billing_start_date}
                    onChange={(e) => {
                      setInputData({
                        ...inputData,
                        hs_recurring_billing_start_date: e.target.value,
                        hs_billing_start_delay_type: "",
                        hs_billing_start_delay_days: "",
                        hs_billing_start_delay_months: "",
                      });
                    }}
                  />
                  <Button
                    onClick={() => {
                      setIsModalOpen({
                        ...isModalOpen,
                        "custom date": false,
                      });

                      // setStartBillingTerm("");
                    }}
                  >
                    Submit
                  </Button>
                </DialogContent>
              </Dialog>
            </SelectItem>
            <SelectItem value="delayed start (months)">
              <Dialog
                open={isModalOpen["delayed start (months)"]}
                onOpenChange={(e) =>
                  setIsModalOpen({
                    ...isModalOpen,
                    "delayed start (months)": e,
                  })
                }
              >
                <DialogTrigger>Delayed Start (months)</DialogTrigger>
                <DialogContent>
                  <Input
                    type="text"
                    placeholder="Enter number of months"
                    value={inputData.hs_billing_start_delay_months}
                    onChange={(e) => {
                      setInputData({
                        ...inputData,
                        hs_billing_start_delay_months: e.target.value,
                        hs_billing_start_delay_type:
                          "hs_billing_start_delay_months",
                        hs_recurring_billing_start_date: "",
                        hs_billing_start_delay_days: "",
                      });
                    }}
                  />
                  <Button
                    onClick={() => {
                      setIsModalOpen({
                        ...isModalOpen,
                        "delayed start (months)": false,
                      });
                      // setStartBillingTerm("");
                    }}
                  >
                    Submit
                  </Button>
                </DialogContent>
              </Dialog>
            </SelectItem>
            <SelectItem value="delayed start (days)">
              <Dialog
                open={isModalOpen["delayed start (days)"]}
                onOpenChange={(e) =>
                  setIsModalOpen({
                    ...isModalOpen,
                    "delayed start (days)": e,
                  })
                }
              >
                <DialogTrigger>Delayed Start (days)</DialogTrigger>
                <DialogContent>
                  <Input
                    type="text"
                    placeholder="Enter number of days"
                    value={inputData.hs_billing_start_delay_days}
                    onChange={(e) => {
                      setInputData({
                        ...inputData,
                        hs_billing_start_delay_days: e.target.value,
                        hs_billing_start_delay_type:
                          "hs_billing_start_delay_days",
                        hs_recurring_billing_start_date: "",
                        hs_billing_start_delay_months: "",
                      });
                    }}
                  />
                  <Button
                    onClick={() => {
                      setIsModalOpen({
                        ...isModalOpen,
                        "delayed start (days)": false,
                      });
                      // setStartBillingTerm("");
                    }}
                  >
                    Submit
                  </Button>
                </DialogContent>
              </Dialog>
            </SelectItem>
            <SelectItem value="at payment">At Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BillingStartDateEdit;
