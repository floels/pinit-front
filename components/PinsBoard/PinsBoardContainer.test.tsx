import { render, waitFor, act, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import PinsBoardContainer from "./PinsBoardContainer";
import { toast } from "react-toastify";
import { PinType } from "@/lib/types";
import { API_ROUTE_PIN_SUGGESTIONS } from "@/lib/constants";
import { mockIntersectionObserver } from "@/lib/utils/testing";

const SUGGESTIONS_ENDPOINT_PAGE_SIZE = 50;

jest.mock("react-toastify", () => ({
  toast: {
    warn: jest.fn(),
  },
}));

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
  mockIntersectionObserver();
});

const renderComponent = () => {
  render(
    <PinsBoardContainer
      initialPins={initialPins}
      fetchPinsAPIRoute={API_ROUTE_PIN_SUGGESTIONS}
    />,
  );
};

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
    `${API_ROUTE_PIN_SUGGESTIONS}?page=2`,
    JSON.stringify({ results: newPins }),
  );

  renderComponent();

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

  renderComponent();

  expect(screen.queryByTestId("loading-spinner")).toBeNull();

  simulateScrollToBottomOfPage();

  screen.getByTestId("loading-spinner");
});

it("should display error message in case of KO response upon new thumbnails fetch", async () => {
  fetchMock.doMockOnceIf(
    `${API_ROUTE_PIN_SUGGESTIONS}?page=2`,
    JSON.stringify({}),
    { status: 400 },
  );

  renderComponent();

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    screen.getByText(en.PinsBoard.ERROR_DISPLAY_PINS);
  });
});

it("should display toast in case of fetch failure upon new thumbnails fetch", async () => {
  fetchMock.mockRejectOnce(new Error("Network failure"));

  renderComponent();

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    expect(toast.warn).toHaveBeenLastCalledWith(
      en.Common.CONNECTION_ERROR,
      expect.anything(), // we don't really care about the options argument here
    );
  });
});
