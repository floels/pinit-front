// Inspired by https://github.com/TkDodo/testing-react-query/blob/main/src/tests/utils.tsx
// referenced in https://tkdodo.eu/blog/testing-react-query#putting-it-all-together

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const renderWithQueryClient = (children: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>,
  );
};
