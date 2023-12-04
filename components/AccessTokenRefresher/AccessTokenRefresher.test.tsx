import { render, waitFor, screen, act } from "@testing-library/react";
import AccessTokenRefresher from "./AccessTokenRefresher";
import en from "@/messages/en.json";

const mockRouterRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: mockRouterRefresh,
  }),
  usePathname: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

it("should refresh the current route when receiving OK response from token refresh endpoint", async () => {
  fetchMock.doMockOnceIf(
    "/api/user/refresh-token",
    JSON.stringify({ access_token: "refreshedAccessToken" }),
  );

  render(<AccessTokenRefresher />);

  await waitFor(() => expect(mockRouterRefresh).toHaveBeenCalledTimes(1));
});

it("should call logout endpoint and refresh page when receiving KO response from token refresh endpoint", async () => {
  // Inspired by https://stackoverflow.com/a/55771671
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload: jest.fn() },
  });

  fetchMock.doMockOnceIf(
    "/api/user/refresh-token",
    JSON.stringify({ errors: [{ code: "invalid_refresh_token" }] }),
    { status: 401 },
  );

  render(<AccessTokenRefresher />);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith("/api/user/log-out", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
  });
});

it("should render unauthenticated homepage when fetch fails", async () => {
  fetchMock.mockReject(new Error("Network failure"));

  // Since there is asynchronous behavior in the `useEffect` hook of <AccessTokenRefresher />, we need to wrap the `render()` in an `act()`.
  // Otherwise, the test fails.
  await act(async () => {
    render(<AccessTokenRefresher />);
  });

  screen.getByText(en.LandingPageContent.PictureSlider.GET_YOUR_NEXT);
});
