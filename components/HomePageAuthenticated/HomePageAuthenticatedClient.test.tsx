import { render, waitFor, act, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import Cookies from "js-cookie";
import { AccountType } from "@/app/[locale]/page";
import en from "@/messages/en.json";
import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";
import {
  API_BASE_URL,
  ENDPOINT_GET_PIN_SUGGESTIONS,
  ENDPOINT_REFRESH_TOKEN,
} from "@/lib/constants";

const accounts = [
  {
    type: "personal",
    username: "johndoe",
    displayName: "John Doe",
    initial: "J",
    ownerEmail: "john.doe@example.com",
  },
] as AccountType[];

const NUMBER_INITIAL_SUGGESTIONS = 100;

const initialPinSuggestions = Array.from(
  { length: NUMBER_INITIAL_SUGGESTIONS },
  (_, index) => ({
    id: String(index + 1),
    imageURL: "https://some.url",
    title: "",
    description: "",
    authorUsername: "johndoe",
    authorDisplayName: "John Doe",
  })
) as PinSuggestionType[];

const labels = {
  commons: en.Common,
  component: en.HomePageAuthenticated,
};

jest.mock("js-cookie", () => ({
  get: jest.fn(), // Needed for the `refreshAccessToken` function to get the refresh token
  set: jest.fn(),
}));

global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: () => [],
}));

// Mock the initial viewportWidth to result in a definite number of columns
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1200,
});

it("should fetch new pin suggestions when user scrolls to bottom", async () => {
  fetchMock.doMockOnceIf(
    `${API_BASE_URL}/${ENDPOINT_REFRESH_TOKEN}`,
    JSON.stringify({ access_token: "refreshed_access_token" })
  );

  const NUMBER_NEW_SUGGESTIONS = 100;

  const newPinSuggestions = Array.from(
    { length: NUMBER_NEW_SUGGESTIONS },
    (_, index) => ({
      id: String(NUMBER_INITIAL_SUGGESTIONS + index + 1),
      imageURL: "https://some.url",
      title: "",
      description: "",
      authorUsername: "johndoe",
      authorDisplayName: "John Doe",
    })
  ) as PinSuggestionType[];

  fetchMock.doMockOnceIf(
    `${API_BASE_URL}/${ENDPOINT_GET_PIN_SUGGESTIONS}?page=2`,
    JSON.stringify({ results: newPinSuggestions })
  );

  render(
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
    />
  );

  const initialRenderedPinSuggestions = screen.getAllByTestId("pin-suggestion");

  expect(initialRenderedPinSuggestions).toHaveLength(
    NUMBER_INITIAL_SUGGESTIONS
  );

  // Simulate the intersection of the sentinel div with the bottom of the viewport
  // by directly triggering the IntersectionObserver callback:
  const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
  act(() => {
    callback([{ isIntersecting: true }]);
  });

  await waitFor(() => {
    const renderedPinSuggestions = screen.getAllByTestId("pin-suggestion");
    expect(renderedPinSuggestions).toHaveLength(
      NUMBER_INITIAL_SUGGESTIONS + NUMBER_NEW_SUGGESTIONS
    );
  });
});

it("should refresh access token after initial render", async () => {
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

it("should render with the right number of columns", () => {
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

  const gridContainer = screen.getByTestId("pin-suggestions-container");

  expect(gridContainer.style.columnCount).toBe("4");
});
