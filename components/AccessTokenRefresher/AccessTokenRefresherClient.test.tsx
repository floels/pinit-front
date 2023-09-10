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

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

const Cookies = require("js-cookie");

const labels = {
  component: en.HomePageUnauthenticated,
  commons: en.Common,
};

const accessTokenRefresher = <AccessTokenRefresherClient labels={labels} />;

it("should refresh the current route when receiving a OK response from token refresh endpoint", async () => {
  fetchMock.doMockOnceIf(
    `${API_BASE_URL}/${ENDPOINT_REFRESH_TOKEN}`,
    JSON.stringify({ access_token: "refreshedAccessToken" }),
  );

  mockedRouter.refresh = jest.fn();

  render(accessTokenRefresher);

  await waitFor(() => expect(mockedRouter.refresh).toHaveBeenCalledTimes(1));
});

it("should refresh the page when receiving KO response from token refresh endpoint", async () => {
  // Inspired by https://stackoverflow.com/a/55771671
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload: jest.fn() },
  });

  fetchMock.doMockOnceIf(
    `${API_BASE_URL}/${ENDPOINT_REFRESH_TOKEN}`,
    JSON.stringify({ errors: [{ code: "invalid_refresh_token" }] }),
    { status: 401 },
  );

  render(accessTokenRefresher);

  await waitFor(() => {
    expect(Cookies.remove).toHaveBeenCalledWith("accessToken");
    expect(Cookies.remove).toHaveBeenCalledWith("refreshToken");

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});

it("should render unauthenticated homepage when fetch fails", async () => {
  // Since we are not mocking fetch here, calling it will trigger an error in <AccessTokenRefresher />, which is the case we want to test.
  // Since there is asynchronous behavior in the `useEffect` hook of <AccessTokenRefresher />, we need to wrap the `render()` in an `act()`.
  // Otherwise, the test won't pass.
  await act(async () => {
    render(accessTokenRefresher);
  });

  screen.getByText(en.HomePageUnauthenticated.PictureSlider.GET_YOUR_NEXT);
});
