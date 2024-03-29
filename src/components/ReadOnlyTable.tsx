"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDateFromObject } from "@/lib/utils";
import { CollectionDataType } from "@/types";

const ReadOnlyTable = ({ data }: { data: CollectionDataType[] }) => {
  return (
    <div className="min-h-96">
      <Table className="max-w-7xl mx-auto mt-10  ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Billing Start Date</TableHead>
            <TableHead className="w-[100px]">Term(Months)</TableHead>
            <TableHead className="w-[100px]">Billing Frequency</TableHead>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead className="w-[100px]">Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((data, index) => (
            <TableRow key={index}>
              <TableCell>
                {getDateFromObject(new Date(data.billing_start_date))}
              </TableCell>
              <TableCell>{data.term}</TableCell>
              <TableCell>{data.billing_frequency}</TableCell>
              <TableCell>{data.quantity}</TableCell>
              <TableCell>{data.discount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReadOnlyTable;
