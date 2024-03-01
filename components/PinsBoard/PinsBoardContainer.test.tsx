import { render, waitFor, act, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import PinsBoardContainer from "./PinsBoardContainer";
import { ToastContainer, toast } from "react-toastify";
import { Pin } from "@/lib/types";
import { API_ROUTE_PIN_SUGGESTIONS } from "@/lib/constants";
import { mockIntersectionObserver } from "@/lib/testing-utils/misc";
import {
  MOCK_API_RESPONSES,
  MOCK_API_RESPONSES_JSON,
  MOCK_API_RESPONSES_SERIALIZED,
} from "@/lib/testing-utils/mockAPIResponses";

const initialPins =
  MOCK_API_RESPONSES_SERIALIZED[API_ROUTE_PIN_SUGGESTIONS].results;

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
    <>
      <ToastContainer />
      <PinsBoardContainer
        initialPins={initialPins}
        fetchPinsAPIRoute={API_ROUTE_PIN_SUGGESTIONS}
      />
    </>,
  );
};

it("fetches new thumbnails when user scrolls to bottom", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_PIN_SUGGESTIONS}?page=2`,
    MOCK_API_RESPONSES[API_ROUTE_PIN_SUGGESTIONS],
  );

  renderComponent();

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    const renderedPinThumbnails = screen.getAllByTestId("pin-thumbnail");

    const expectedNumberThumbnails =
      initialPins.length +
      MOCK_API_RESPONSES_JSON[API_ROUTE_PIN_SUGGESTIONS].results.length;

    expect(renderedPinThumbnails).toHaveLength(expectedNumberThumbnails);
  });
});

it("displays loading spinner while fetching new thumbnails", () => {
  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  renderComponent();

  expect(screen.queryByTestId("loading-spinner")).toBeNull();

  simulateScrollToBottomOfPage();

  screen.getByTestId("loading-spinner");
});

it("displays error message in case of KO response upon new thumbnails fetch", async () => {
  fetchMock.mockOnceIf(`${API_ROUTE_PIN_SUGGESTIONS}?page=2`, "{}", {
    status: 400,
  });

  renderComponent();

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    screen.getByText(en.PinsBoard.ERROR_DISPLAY_PINS);
  });
});

it("displays toast in case of fetch failure upon new thumbnails fetch", async () => {
  fetchMock.mockRejectOnce();

  renderComponent();

  simulateScrollToBottomOfPage();

  await waitFor(() => {
    screen.getByText(en.Common.CONNECTION_ERROR);
  });
});
