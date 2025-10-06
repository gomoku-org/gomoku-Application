import React, { createContext, useContext, useMemo } from "react";
import { ApiClient } from "./client";

const ApiContext = createContext(null);

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const ApiProvider = ({ baseUrl = apiUrl, timeoutMs = 10000, children }) => {
  const client = useMemo(() => new ApiClient(baseUrl, timeoutMs), [baseUrl, timeoutMs]);
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
};

export const useApiClient = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApiClient must be used within an ApiProvider");
  return ctx;
};
