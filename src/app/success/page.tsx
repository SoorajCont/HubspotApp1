"use client";

import { Button } from "@/components/ui/button";
import { runFireworks } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

const SuccessPage = ({
  searchParams,
}: {
  searchParams: {
    portalId: string;
  };
}) => {
  useEffect(() => {
    runFireworks();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 m-auto max-w-7xl">
      <h1 className="text-3xl font-semibold text-orange-500 ">
        App Installed Successfully
      </h1>
      <Button variant="default">
        <Link
          href={`https://app.hubspot.com/discover/${searchParams.portalId}/library/dashboards`}
        >
          Go Back to Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default SuccessPage;
