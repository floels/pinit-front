"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AccountsContextProvider } from "@/contexts/accountsContext";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ClientsAndContextsProviderProps = {
  children: React.ReactNode;
};

const ClientsAndContextsProvider = ({
  children,
}: ClientsAndContextsProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AccountsContextProvider>{children}</AccountsContextProvider>
    </QueryClientProvider>
  );
};

export default ClientsAndContextsProvider;
