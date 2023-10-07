import { render, waitFor, act, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import PinsBoardClient from "./PinsBoardClient";
import { PinThumbnailType } from "./PinThumbnail";
import { toast } from "react-toastify";

const SUGGESTIONS_ENDPOINT_PAGE_SIZE = 50;

jest.mock("react-toastify", () => ({
  toast: {
    warn: jest.fn(),
  },
}));

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1200,
});

const initialPinThumbnails = Array.from(
  { length: SUGGESTIONS_ENDPOINT_PAGE_SIZE },
  (_, index) => ({
    id: String(index + 1),
    imageURL: "https://some.url",
    title: "",
    description: "",
    authorUsername: "johndoe",
    authorDisplayName: "John Doe",
  }),
) as PinThumbnailType[];

const labels = {
  commons: en.Common,
  component: en.HomePage.Content,
};

const simulateScrollToBottomOfPage = () => {
  const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
  act(() => {
    callback([{ isIntersecting: true }]);
  });
};

beforeEach(() => {
  global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
    takeRecords: () => [],
  }));
});

it("should fetch new thumbnails when user scrolls to bottom", async () => {
  const newPinThumbnails = Array.from(
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
    JSON.stringify({ results: newPinThumbnails }),
  );

  render(
    <PinsBoardClient
      initialPinThumbnails={initialPinThumbnails}
      fetchThumbnailsAPIRoute="/api/pins/suggestions"
      labels={labels}
    />,
  );

  const initialRenderedPinSuggestions = screen.getAllByTestId("pin-thumbnail");

  expect(initialRenderedPinSuggestions).toHaveLength(
    SUGGESTIONS_ENDPOINT_PAGE_SIZE,
  );

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    const renderedPinThumbnails = screen.getAllByTestId("pin-thumbnail");
    expect(renderedPinThumbnails).toHaveLength(
      2 * SUGGESTIONS_ENDPOINT_PAGE_SIZE,
    );
  });
});

it("should display loading spinner while fetching new thumbnails", async () => {
  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  render(
    <PinsBoardClient
      initialPinThumbnails={initialPinThumbnails}
      fetchThumbnailsAPIRoute="/api/pins/suggestions"
      labels={labels}
    />,
  );

  expect(screen.queryByTestId("loading-spinner")).toBeNull();

  simulateScrollToBottomOfPage();

  screen.getByTestId("loading-spinner");
});

it("should display error message in case of KO response upon new thumbnails fetch", async () => {
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
    <PinsBoardClient
      initialPinThumbnails={initialPinThumbnails}
      fetchThumbnailsAPIRoute="/api/pins/suggestions"
      labels={labels}
    />,
  );

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    screen.getByText(en.HomePage.Content.ERROR_DISPLAY_PINS);
  });
});

it("should display toast in case of fetch failure upon new thumbnails fetch", async () => {
  render(
    <PinsBoardClient
      initialPinThumbnails={initialPinThumbnails}
      fetchThumbnailsAPIRoute="/api/pins/suggestions"
      labels={labels}
    />,
  );

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    expect(toast.warn).toHaveBeenCalledWith(en.Common.CONNECTION_ERROR);
  });
});
