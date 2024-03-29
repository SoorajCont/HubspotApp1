import { getCollectionData } from "@/actions/collections";
import DataTable from "@/components/DataTable";
import { CollectionDataType } from "@/types";
import React from "react";

interface SearchParamsProps {
  searchParams: {
    collection: string;
    portalId: string;
    userId: string;
  };
}

const TablePage = async ({
  searchParams: { collection, portalId, userId },
}: SearchParamsProps) => {
  const collectionData: CollectionDataType[] = (await getCollectionData(
    `Account_${portalId}`,
    collection
  )) as CollectionDataType[];

  return (
    collectionData && (
      <DataTable
        data={collectionData}
        portalId={portalId}
        collection={collection}
        userId={userId}
      />
    )
  );
};

export default TablePage;
