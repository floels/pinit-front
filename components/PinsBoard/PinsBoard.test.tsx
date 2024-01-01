import { render, waitFor, act, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import PinsBoard from "./PinsBoard";
import { toast } from "react-toastify";
import { PinType } from "@/lib/types";
import { API_ROUTE_PINS_SUGGESTIONS } from "@/lib/constants";

const SUGGESTIONS_ENDPOINT_PAGE_SIZE = 50;

jest.mock("react-toastify", () => ({
  toast: {
    warn: jest.fn(),
  },
}));

const VIEWPORT_WIDTH_PX = 1200;

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: VIEWPORT_WIDTH_PX,
});

const initialPins = Array.from(
  { length: SUGGESTIONS_ENDPOINT_PAGE_SIZE },
  (_, index) => ({
    id: String(index + 1),
    imageURL: "https://pin.url",
    title: "",
    description: "",
    authorUsername: "johndoe",
    authorDisplayName: "John Doe",
  }),
) as PinType[];

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

const pinsBoardComponent = (
  <PinsBoard
    initialPins={initialPins}
    fetchPinsAPIRoute={API_ROUTE_PINS_SUGGESTIONS}
  />
);

it("should render the thumbnails with the right number of columns", () => {
  render(pinsBoardComponent);

  const initialRenderedPinSuggestions = screen.getAllByTestId("pin-thumbnail");

  expect(initialRenderedPinSuggestions).toHaveLength(
    SUGGESTIONS_ENDPOINT_PAGE_SIZE,
  );

  const thumbnailsColumns = screen.getAllByTestId("thumbnails-column");

  expect(thumbnailsColumns).toHaveLength(4); // given `const VIEWPORT_WIDTH_PX = 1200;`
});

it("should fetch new thumbnails when user scrolls to bottom", async () => {
  const newPins = Array.from(
    { length: SUGGESTIONS_ENDPOINT_PAGE_SIZE },
    (_, index) => ({
      unique_id: String(SUGGESTIONS_ENDPOINT_PAGE_SIZE + index + 1),
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
    `${API_ROUTE_PINS_SUGGESTIONS}?page=2`,
    JSON.stringify({ results: newPins }),
  );

  render(pinsBoardComponent);

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    const renderedPinThumbnails = screen.getAllByTestId("pin-thumbnail");
    expect(renderedPinThumbnails).toHaveLength(
      2 * SUGGESTIONS_ENDPOINT_PAGE_SIZE,
    );
  });
});

it("should display loading spinner while fetching new thumbnails", () => {
  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  render(pinsBoardComponent);

  expect(screen.queryByTestId("loading-spinner")).toBeNull();

  simulateScrollToBottomOfPage();

  screen.getByTestId("loading-spinner");
});

it("should display error message in case of KO response upon new thumbnails fetch", async () => {
  fetchMock.doMockOnceIf(
    `${API_ROUTE_PINS_SUGGESTIONS}?page=2`,
    JSON.stringify({ message: "Bad Request" }),
    { status: 400 },
  );

  render(pinsBoardComponent);

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    screen.getByText(en.PinsBoard.ERROR_DISPLAY_PINS);
  });
});

it("should display toast in case of fetch failure upon new thumbnails fetch", async () => {
  fetchMock.mockRejectOnce(new Error("Network failure"));

  render(pinsBoardComponent);

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    expect(toast.warn).toHaveBeenLastCalledWith(
      en.Common.CONNECTION_ERROR,
      expect.anything(), // we don't really care about the options argument here
    );
  });
});
