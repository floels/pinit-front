import { render, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { mockIntersectionObserver } from "jsdom-testing-mocks";
import { AccountType } from "@/app/[locale]/page";
import en from "@/messages/en.json";
import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";
import { API_BASE_URL, ENDPOINT_REFRESH_TOKEN } from "@/lib/constants";

const accounts = [
  {
    type: "personal",
    username: "johndoe",
    displayName: "John Doe",
    initial: "J",
    ownerEmail: "john.doe@example.com",
  },
] as AccountType[];

const initialPinSuggestions = Array.from({ length: 100 }, (_, index) => ({
  id: String(index + 1),
  imageURL: "https://some.url",
  title: "",
  description: "",
  authorUsername: "johndoe",
  authorDisplayName: "John Doe",
})) as PinSuggestionType[];

const labels = en.HomePageAuthenticated;

jest.mock("js-cookie", () => ({
  get: jest.fn(), // Needed for the `refreshAccessToken` function to get the refresh token
  set: jest.fn(),
}));

const Cookies = require("js-cookie");

mockIntersectionObserver();

it("should refresh token after initial render", async () => {
  fetchMock.doMockOnceIf(
    `${API_BASE_URL}/${ENDPOINT_REFRESH_TOKEN}`,
    JSON.stringify({ access_token: "refreshed_access_token" })
  );

  render(
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
    />
  );

  await waitFor(() => {
    expect(Cookies.set).toHaveBeenCalledWith(
      "accessToken",
      "refreshed_access_token"
    );
  });
});
