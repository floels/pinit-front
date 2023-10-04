import { render, waitFor, screen, act } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import defaultMockRouter, { MemoryRouter } from "next-router-mock";
import AccessTokenRefresherClient from "./AccessTokenRefresherClient";
import { API_BASE_URL, ENDPOINT_REFRESH_TOKEN } from "@/lib/constants";
import en from "@/messages/en.json";

type MockedRouter = MemoryRouter & {
  refresh?: jest.MockedFunction<any>;
};

// See https://www.npmjs.com/package/next-router-mock#jest-example
jest.mock("next/navigation", () => require("next-router-mock"));

const mockedRouter = defaultMockRouter as MockedRouter;

const labels = {
  component: en.HomePageUnauthenticated,
  commons: en.Common,
};

const accessTokenRefresher = <AccessTokenRefresherClient labels={labels} />;

it("should refresh the current route when receiving an OK response from token refresh endpoint", async () => {
  fetchMock.doMockOnceIf(
    "/api/user/refresh-token",
    JSON.stringify({ access_token: "refreshedAccessToken" }),
  );

  mockedRouter.refresh = jest.fn();

  render(accessTokenRefresher);

  await waitFor(() => expect(mockedRouter.refresh).toHaveBeenCalledTimes(1));
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

  screen.getByText(en.HomePageUnauthenticated.PictureSlider.GET_YOUR_NEXT);
});
