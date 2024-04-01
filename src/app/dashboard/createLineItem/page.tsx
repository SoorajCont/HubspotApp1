"use client";

import { getCollectionData } from "@/actions/collections";
import ReadOnlyTable from "@/components/ReadOnlyTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BillingFrequency, BillingStartDate } from "@/constants";
import { cn, decodeSlug, getId, validateTerm } from "@/lib/utils";
import { createLineItemSchema } from "@/lib/validation";
import { CollectionDataType } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

const CreateLineItem = ({
  searchParams: { collection, portalId, dealId, userId },
}: {
  searchParams: {
    portalId: string;
    dealId: string;
    collection: string;
    userId: string;
  };
}) => {
  const [productDataTable, setProductDataTable] = useState<
    CollectionDataType[]
  >([]);
  const router = useRouter();

  const [inputData, setInputData] = useState<
    z.infer<typeof createLineItemSchema>
  >({
    quantity: "",
    hs_product_id: getId(decodeSlug(collection)),
    recurringbillingfrequency: "",
    hs_recurring_billing_period: "",
    hs_recurring_billing_start_date: "At Payment",
    hs_discount_percentage: "",
    hs_billing_start_delay_days: "",
    hs_billing_start_delay_months: "",
    hs_billing_start_delay_type:
      "hs_billing_start_delay_days" || "hs_billing_start_delay_months",
  });

  const [startBillingTerm, setStartBillingTerm] = useState<string>("");

  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<CollectionDataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState({
    "custom date": false,
    "delayed start (months)": false,
    "delayed start (days)": false,
  });
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/crm-card/createLineItem?portalId=${portalId}&dealId=${dealId}`,
        {
          ...inputData,
          hs_recurring_billing_period: `P${inputData.hs_recurring_billing_period}M`,
        }
      );

      console.log(inputData);
      if (!response.data) {
        throw new Error("Line Item not Created");
      }
      toast.success("Line Item created successfully");
      setLoading(false);
      router.push(`/dashboard?portalId=${portalId}&userId=${userId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className=" max-w-7xl m-auto space-y-5">
      <ReadOnlyTable data={filteredData} />

      <div className="flex gap-5 w-full">
        <div className="relative">
          <Button
            className="relative w-[200px] z-10 py-0"
            onClick={() => {
              setIsSelectOpen(true);
            }}
            variant={"outline"}
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
        {/* <Input
          type="date"
          value={inputData.hs_recurring_billing_start_date}
          onChange={(e) =>
            setInputData({
              ...inputData,
              hs_recurring_billing_start_date: e.target.value,
            })
          }
        /> */}
        <Input
          type="text"
          placeholder="Quantity"
          onChange={(e) =>
            setInputData({ ...inputData, quantity: e.target.value })
          }
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
          <SelectTrigger className="">
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
          placeholder="Discount"
          onChange={(e) =>
            setInputData({
              ...inputData,
              hs_discount_percentage: e.target.value,
            })
          }
          value={inputData.hs_discount_percentage}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
};

export default CreateLineItem;
