import { PinType } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import PinsBoard from "./PinsBoard";
import { mockIntersectionObserver } from "@/lib/utils/testing";

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

const renderComponent = () => {
  const props = {
    pins,
    handleFetchMorePins: jest.fn(),
    isFetching: false,
    isFetchError: false,
  };

  render(<PinsBoard {...props} />);
};

beforeEach(() => {
  mockIntersectionObserver();
});

it("should render the thumbnails with the right number of columns", () => {
  renderComponent();

  const renderedPins = screen.getAllByTestId("pin-thumbnail");

  expect(renderedPins).toHaveLength(NUMBER_PINS);

  const thumbnailsColumns = screen.getAllByTestId("thumbnails-column");

  expect(thumbnailsColumns).toHaveLength(4); // given `const VIEWPORT_WIDTH_PX = 1200;`
});

// The rest of the component's behavior is tested in 'PinsBoardContainer.test.tsx'.
