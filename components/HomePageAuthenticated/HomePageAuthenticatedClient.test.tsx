import { render, waitFor, act, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { AccountType } from "@/app/[locale]/page";
import en from "@/messages/en.json";
import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";

const accounts = [
  {
    type: "personal",
    username: "johndoe",
    displayName: "John Doe",
    initial: "J",
    ownerEmail: "john.doe@example.com",
  },
] as AccountType[];

const SUGGESTIONS_ENDPOINT_PAGE_SIZE = 50;

const initialPinSuggestions = Array.from(
  { length: SUGGESTIONS_ENDPOINT_PAGE_SIZE },
  (_, index) => ({
    id: String(index + 1),
    imageURL: "https://some.url",
    title: "",
    description: "",
    authorUsername: "johndoe",
    authorDisplayName: "John Doe",
  }),
) as PinSuggestionType[];

const labels = {
  commons: en.Common,
  component: en.HomePageAuthenticated,
};

global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: () => [],
}));

it("should fetch new pin suggestions when user scrolls to bottom", async () => {
  const newPinSuggestions = Array.from(
    { length: SUGGESTIONS_ENDPOINT_PAGE_SIZE },
    (_, index) => ({
      id: String(SUGGESTIONS_ENDPOINT_PAGE_SIZE + index + 1),
      image_url: "https://some.url",
      title: "",
      description: "",
      author: {
        user_name: "johndoe",
        display_name: "John Doe",
      },
    }),
  );

  fetchMock.doMockOnceIf(
    "/api/pins/suggestions?page=2",
    JSON.stringify({ results: newPinSuggestions }),
  );

  render(
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
    />,
  );

  const initialRenderedPinSuggestions = screen.getAllByTestId("pin-suggestion");

  expect(initialRenderedPinSuggestions).toHaveLength(
    SUGGESTIONS_ENDPOINT_PAGE_SIZE,
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
      2 * SUGGESTIONS_ENDPOINT_PAGE_SIZE,
    );
  });
});

it("should display toast in case of KO response upon new suggestions fetch", async () => {
  fetchMock.doMockOnceIf("/api/pins/suggestions?page=2", () =>
    Promise.resolve({
      body: JSON.stringify({ message: "Bad Request" }),
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );

  render(
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
    />,
  );

  // Simulate the intersection of the sentinel div with the bottom of the viewport
  // by directly triggering the IntersectionObserver callback:
  const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
  act(() => {
    callback([{ isIntersecting: true }]);
  });

  await waitFor(() => {
    screen.getByText(en.HomePageAuthenticated.ERROR_FETCH_PIN_SUGGESTIONS);
  });
});

it("should display toast in case of failure upon new suggestions fetch", async () => {
  render(
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
    />,
  );

  // Simulate the intersection of the sentinel div with the bottom of the viewport
  // by directly triggering the IntersectionObserver callback:
  const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
  act(() => {
    callback([{ isIntersecting: true }]);
  });

  await waitFor(() => {
    screen.getByText(en.Common.CONNECTION_ERROR);
  });
});
