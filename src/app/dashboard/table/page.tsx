import { getCollectionData } from "@/actions/collections";
import DataTable from "@/components/DataTable";
import { decodeSlug, removeId } from "@/lib/utils";
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
    <div className="max-w-7xl m-auto space-y-8 ">
      <h1 className="p-10 text-3xl font-bold text-primary underline ">
        {removeId(decodeSlug(collection))}
      </h1>
      {collectionData && (
        <DataTable
          data={collectionData}
          portalId={portalId}
          collection={collection}
          userId={userId}
        />
      )}
    </div>
  );
};

export default TablePage;
