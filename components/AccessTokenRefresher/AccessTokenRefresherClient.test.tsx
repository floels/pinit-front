import { render, waitFor, screen, act } from "@testing-library/react";
import AccessTokenRefresherClient from "./AccessTokenRefresherClient";
import en from "@/messages/en.json";

const mockRouterRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

const labels = {
  commons: en.Common,
  component: {
    ...en.LandingPage.Content,
    LoginForm: en.LandingPage.Header.LoginForm,
    SignupForm: en.LandingPage.Header.LoginForm,
  },
};

const accessTokenRefresher = <AccessTokenRefresherClient labels={labels} />;

it("should refresh the current route when receiving an OK response from token refresh endpoint", async () => {
  fetchMock.doMockOnceIf(
    "/api/user/refresh-token",
    JSON.stringify({ access_token: "refreshedAccessToken" }),
  );

  render(accessTokenRefresher);

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

  render(accessTokenRefresher);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith("/api/user/log-out", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});

it("should render unauthenticated homepage when fetch fails", async () => {
  fetchMock.mockRejectOnce(new Error("Network failure"));

  // Since there is asynchronous behavior in the `useEffect` hook of <AccessTokenRefresher />, we need to wrap the `render()` in an `act()`.
  // Otherwise, the test fails.
  await act(async () => {
    render(accessTokenRefresher);
  });

  screen.getByText(en.LandingPage.Content.PictureSlider.GET_YOUR_NEXT);
});
