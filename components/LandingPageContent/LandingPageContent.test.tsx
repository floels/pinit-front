import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toBeInTheDocument(...)`
import { act, fireEvent, render, screen } from "@testing-library/react";
import LandingPageContent, {
  SCROLLING_DEBOUNCING_TIME_MS,
} from "./LandingPageContent";

// Since the <FifthFold /> component relies on `useRouter` and other
// specific methods, we mock the whole component for simplicity:
jest.mock("@/components/LandingPageContent/FifthFold", () => {
  const MockedFifthFold = () => <div />;

  MockedFifthFold.displayName = "FifthFold";

  return MockedFifthFold;
});

it("should have first fold active upon initial render", () => {
  render(<LandingPageContent />);

  const content = screen.getByTestId("landing-page-content");

  expect(content.className).toEqual("content"); // i.e. first fold is active
});

it("should have second fold active upon initial downscroll", async () => {
  render(<LandingPageContent />);

  fireEvent.wheel(document, { deltaY: 100 });

  const content = screen.getByTestId("landing-page-content");

  expect(content.className).toEqual("content contentSecondFoldActive");
});

it("should not move to third fold if user scrolls again before debounce time", async () => {
  jest.useFakeTimers();

  render(<LandingPageContent />);

  fireEvent.wheel(document, { deltaY: 100 });

  const content = screen.getByTestId("landing-page-content");

  expect(content.className).toEqual("content contentSecondFoldActive");

  jest.advanceTimersByTime(0.5 * SCROLLING_DEBOUNCING_TIME_MS);

  fireEvent.wheel(document, { deltaY: 100 });

  expect(content.className).toEqual("content contentSecondFoldActive");

  jest.clearAllTimers();
});

it("should move to third fold if user scrolls again after debounce time", async () => {
  jest.useFakeTimers();

  render(<LandingPageContent />);

  fireEvent.wheel(document, { deltaY: 100 });

  const content = screen.getByTestId("landing-page-content");

  expect(content.className).toEqual("content contentSecondFoldActive");

  act(() => {
    jest.advanceTimersByTime(2 * SCROLLING_DEBOUNCING_TIME_MS);
  });

  fireEvent.wheel(document, { deltaY: 100 });

  expect(content.className).toEqual("content contentThirdFoldActive");

  jest.clearAllTimers();
});
