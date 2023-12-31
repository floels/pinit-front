import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderSearchBar from "./HeaderSearchBar";
import { API_ROUTE_PINS_SEARCH_AUTOCOMPLETE } from "@/lib/constants";

const mockRouterPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next/link", () => {
  const MockedLink = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  );

  MockedLink.displayName = "Link";

  return MockedLink;
});

it("should reset input value and blur input upon pressing Escape", async () => {
  render(<HeaderSearchBar />);

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, "abc");

  expect(document.activeElement).toEqual(searchInput);
  expect(searchInput).toHaveValue("abc");

  userEvent.keyboard("[Escape]");

  await waitFor(() => {
    expect(searchInput).toHaveValue("");

    expect(document.activeElement).not.toEqual(searchInput);
  });
});

it("should reset input value, blur input and hide Clear icon upon pressing the Clear icon", async () => {
  render(<HeaderSearchBar />);

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, "abc");

  expect(document.activeElement).toEqual(searchInput);
  expect(searchInput).toHaveValue("abc");

  const clearIcon = screen.getByTestId("clear-icon");

  userEvent.click(clearIcon);

  await waitFor(() => {
    expect(searchInput).toHaveValue("");

    expect(document.activeElement).not.toEqual(searchInput);

    expect(screen.queryByTestId("clear-icon")).toBeNull();
  });
});

it("should hide icon when focusing the input", async () => {
  render(<HeaderSearchBar />);

  screen.getByTestId("search-icon");

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);

  expect(screen.queryByTestId("search-icon")).toBeNull();
});

it("should display autocomplete suggestions and navigate to search route when user clicks one", async () => {
  const searchTerm = "foo";

  const numberSuggestions = 12;

  const dummySuggestions = Array.from(
    { length: numberSuggestions },
    (_, index) => `foo suggestion ${index + 1}`,
  ); // so dummySuggestions === ["foo suggestion 1", "foo suggestion 2", ..., "foo suggestion 12"]

  fetchMock.mockOnceIf(
    `${API_ROUTE_PINS_SEARCH_AUTOCOMPLETE}?search=${searchTerm}`,
    JSON.stringify({ results: dummySuggestions }),
  );

  render(<HeaderSearchBar />);

  const searchInput = screen.getByTestId("search-bar-input");

  expect(screen.queryByTestId("autocomplete-suggestions-list")).toBeNull();

  await userEvent.click(searchInput);

  await userEvent.type(searchInput, searchTerm);

  await waitFor(() => {
    screen.getByTestId("autocomplete-suggestions-list");
  });

  const autoCompleteSuggestionsList = screen.getByTestId(
    "autocomplete-suggestions-list",
  );

  const autoCompleteSuggestionsListItems = within(
    autoCompleteSuggestionsList,
  ).getAllByTestId("autocomplete-suggestions-list-item");

  expect(autoCompleteSuggestionsListItems).toHaveLength(numberSuggestions);

  // Check that the component inserted the search term as first suggestion:
  expect(autoCompleteSuggestionsListItems[0]).toHaveTextContent("foo");
  expect(autoCompleteSuggestionsListItems[1]).toHaveTextContent(
    "foo suggestion 1",
  );

  await userEvent.click(autoCompleteSuggestionsListItems[1]);

  expect(mockRouterPush).toHaveBeenLastCalledWith(
    `/search/pins?q=foo suggestion 1`,
  );
});

it("should navigate to /search/pins route when user types and presses Enter", async () => {
  render(<HeaderSearchBar />);

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);
  await userEvent.type(searchInput, "foo");
  await userEvent.keyboard("[Enter]");

  expect(mockRouterPush).toHaveBeenLastCalledWith(`/search/pins?q=foo`);
});
