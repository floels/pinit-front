"use client";

import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

type QueryClientProviderProps = {
  children: React.ReactNode;
};

const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};

export default QueryClientProvider;
