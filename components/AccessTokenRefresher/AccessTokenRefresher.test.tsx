import { waitFor } from "@testing-library/react";
import AccessTokenRefresher from "./AccessTokenRefresher";
import { API_ROUTE_LOG_OUT, API_ROUTE_REFRESH_TOKEN } from "@/lib/constants";
import { renderWithQueryClient } from "@/lib/utils/testing";

const mockRouterRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

afterEach(() => {
  jest.resetAllMocks();
});

it("should refresh the current route when receiving OK response from token refresh endpoint", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_REFRESH_TOKEN,
    JSON.stringify({ access_token: "refreshedAccessToken" }),
  );

  renderWithQueryClient(<AccessTokenRefresher />);

  await waitFor(() => expect(mockRouterRefresh).toHaveBeenCalledTimes(1));
});

it("should call logout endpoint and refresh page when receiving KO response from token refresh endpoint", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_REFRESH_TOKEN,
    JSON.stringify({ errors: [{ code: "invalid_refresh_token" }] }),
    { status: 401 },
  );

  renderWithQueryClient(<AccessTokenRefresher />);

  await waitFor(() => {
    expect(fetch).toHaveBeenLastCalledWith(API_ROUTE_LOG_OUT, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  });

  await waitFor(() => expect(mockRouterRefresh).toHaveBeenCalledTimes(1));
});
