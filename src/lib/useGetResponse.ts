"use client";

import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { useState } from "react";

export const useGetResponse = (portalId: number, fn: () => void) => {
  const [data, setData] = useState([]);
};
