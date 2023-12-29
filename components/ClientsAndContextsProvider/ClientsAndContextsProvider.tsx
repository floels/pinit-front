"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ActiveAccountContextProvider } from "@/contexts/ActiveAccountContext";
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
      <ActiveAccountContextProvider>{children}</ActiveAccountContextProvider>
    </QueryClientProvider>
  );
};

export default ClientsAndContextsProvider;
