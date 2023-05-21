import { render, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import defaultMockRouter, { MemoryRouter } from "next-router-mock";
import AccessTokenRefresher from "./AccessTokenRefresher";

type MockedRouter = MemoryRouter & {
  refresh?: jest.MockedFunction<any>;
};

// See https://www.npmjs.com/package/next-router-mock#jest-example
jest.mock("next/navigation", () => require("next-router-mock"));

const mockedRouter = defaultMockRouter as MockedRouter;

describe("AccessTokenRefresh", () => {
  it("should refresh the current route when receiving a 200 OK response from token refresh endpoint", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ access_token: "refreshedAccessToken" })
    );

    mockedRouter.refresh = jest.fn(() => {
      console.log("router.refresh() was called!");
    });

    render(<AccessTokenRefresher />);

    await waitFor(() => expect(mockedRouter.refresh).toHaveBeenCalledTimes(1));
  });
});
