"use client";

import React from "react";
import { Button } from "./ui/button";
import { dropCollection } from "@/actions/collections";
import toast from "react-hot-toast";

const DeleteCollection = ({
  portalId,
  collectionName,
}: {
  portalId: string;
  collectionName: string;
}) => {
  const handleDelete = async (collectionName: string) => {
    const response = await dropCollection(
      `Account_${portalId}`,
      collectionName
    );
    if (!response) {
      throw new Error("Something went wrong");
    }
    toast.success("Product deleted successfully");
    window.location.reload();
  };
  return (
    <Button
      variant={"destructive"}
      onClick={() => handleDelete(collectionName)}
    >
      Delete Product
    </Button>
  );
};

export default DeleteCollection;
