import { PinType } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import PinsBoard from "./PinsBoard";
import { mockIntersectionObserver } from "@/lib/utils/testing";
import en from "@/messages/en.json";

const VIEWPORT_WIDTH_PX = 1200;

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: VIEWPORT_WIDTH_PX,
});

const NUMBER_PINS = 50;

const pins = Array.from({ length: NUMBER_PINS }, (_, index) => ({
  id: String(index + 1),
  imageURL: "https://pin.url",
  title: "",
  description: "",
  authorUsername: "johndoe",
  authorDisplayName: "John Doe",
})) as PinType[];

beforeEach(() => {
  mockIntersectionObserver();
});

it("renders the thumbnails with the right number of columns", () => {
  render(
    <PinsBoard
      pins={pins}
      isFetching={false}
      fetchFailed={false}
      onScrolledToBottom={jest.fn()}
    />,
  );

  const renderedPins = screen.getAllByTestId("pin-thumbnail");

  expect(renderedPins).toHaveLength(NUMBER_PINS);

  const thumbnailsColumns = screen.getAllByTestId("thumbnails-column");

  expect(thumbnailsColumns).toHaveLength(4); // given `const VIEWPORT_WIDTH_PX = 1200;`
});

it("renders empty results message when pins table is empty", () => {
  render(
    <PinsBoard
      pins={[]}
      isFetching={false}
      fetchFailed={false}
      onScrolledToBottom={jest.fn()}
      emptyResultsMessageKey="PinsSearch.NO_RESULTS"
    />,
  );

  screen.getByText(en.PinsSearch.NO_RESULTS);
});

// The rest of the component's behavior is tested in 'PinsBoardContainer.test.tsx'.
