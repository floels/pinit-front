/**
 * @jest-environment jsdom
 */

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { render, waitFor } from "@testing-library/react";
import defaultMockRouter, { MemoryRouter } from "next-router-mock";
import AccessTokenRefresher from "./AccessTokenRefresher";

type MockedRouter = MemoryRouter & {
  refresh?: jest.MockedFunction<any>;
};

// https://github.com/jefflau/jest-fetch-mock#to-setup-for-an-individual-test
enableFetchMocks();

// See https://www.npmjs.com/package/next-router-mock#jest-example
jest.mock("next/navigation", () => require("next-router-mock"));

const mockedRouter = defaultMockRouter as MockedRouter;

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

const Cookies = require("js-cookie");

describe("AccessTokenRefresh", () => {
  it("should refresh the current route when receiving a 200 OK response from token refresh endpoint", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ access_token: "refreshedAccessToken" })
    );

    mockedRouter.refresh = jest.fn();

    render(<AccessTokenRefresher />);

    await waitFor(() => expect(mockedRouter.refresh).toHaveBeenCalledTimes(1));
  });

  it("should refresh the page when receiving KO response from token refresh endpoint", async () => {
    // Inspired by https://stackoverflow.com/a/55771671
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload: jest.fn() },
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({ errors: [{ code: "invalid_refresh_token" }] }),
      { status: 401 }
    );

    render(<AccessTokenRefresher />);

    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith("accessToken");
      expect(Cookies.remove).toHaveBeenCalledWith("refreshToken");

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
