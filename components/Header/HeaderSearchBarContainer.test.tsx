import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderSearchBarContainer, {
  AUTOCOMPLETE_DEBOUNCE_TIME_MS,
} from "./HeaderSearchBarContainer";
import { API_ROUTE_SEARCH_SUGGESTIONS } from "@/lib/constants";
import { usePathname } from "next/navigation";

const mockPush = jest.fn();
const mockGetSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: jest.fn(),
  useSearchParams: () => ({ get: mockGetSearchParams }),
}));

const mockedUsePathname = usePathname as jest.Mock;

jest.mock("next/link", () => {
  const MockedLink = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  );

  MockedLink.displayName = "Link";

  return MockedLink;
});

const NUMBER_MOCK_SUGGESTIONS = 12;

const MOCK_SUGGESTIONS = Array.from(
  { length: NUMBER_MOCK_SUGGESTIONS },
  (_, index) => `suggestion ${index + 1}`,
); // i.e. ["suggestion 1", "suggestion 2", ..., "suggestion 12"]

const clickSearchInput = async () => {
  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);
};

const typeSearchTerm = async (searchTerm: string) => {
  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, searchTerm);
};

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllTimers();
});

it("resets input value and blur input upon pressing Escape", async () => {
  render(<HeaderSearchBarContainer />);

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, "abc");

  expect(document.activeElement).toEqual(searchInput);
  expect(searchInput).toHaveValue("abc");

  await userEvent.keyboard("[Escape]");

  await waitFor(() => {
    expect(searchInput).toHaveValue("");

    expect(document.activeElement).not.toEqual(searchInput);
  });
});

it("resets input value, blurs input and hides 'Clear' icon upon pressing 'Clear' icon", async () => {
  render(<HeaderSearchBarContainer />);

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

it("hides icon when input gets focus", async () => {
  render(<HeaderSearchBarContainer />);

  screen.getByTestId("search-icon");

  await clickSearchInput();

  expect(screen.queryByTestId("search-icon")).toBeNull();
});

it("displays search suggestions with search term as first suggestion", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("a");

  await waitFor(() => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    expect(searchSuggestionsListItems).toHaveLength(NUMBER_MOCK_SUGGESTIONS);

    expect(searchSuggestionsListItems[0]).toHaveTextContent("a");
    expect(searchSuggestionsListItems[1]).toHaveTextContent("suggestion 1");
  });
});

it("displays search suggestions as such if search term is already among suggestions", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    JSON.stringify({
      results: ["a", ...MOCK_SUGGESTIONS.slice(0, NUMBER_MOCK_SUGGESTIONS - 1)],
    }),
  );

  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("a");

  await waitFor(() => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    expect(searchSuggestionsListItems[0]).toHaveTextContent("a");
    expect(searchSuggestionsListItems[1]).toHaveTextContent("suggestion 1");
  });
});

it("navigates to search route when user clicks suggestion", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("a");

  await waitFor(async () => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    await userEvent.click(searchSuggestionsListItems[1]);

    expect(mockPush).toHaveBeenLastCalledWith(`/search/pins?q=suggestion 1`);
  });
});

it("navigates to /search/pins route when user types and presses Enter", async () => {
  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("a");

  await userEvent.keyboard("[Enter]");

  expect(mockPush).toHaveBeenLastCalledWith(`/search/pins?q=a`);
});

it("sets the input value based on the search param", async () => {
  mockedUsePathname.mockReturnValue("/en/search/pins");
  mockGetSearchParams.mockReturnValue("foo");

  render(<HeaderSearchBarContainer />);

  const searchInput = screen.getByTestId("search-bar-input");
  expect(searchInput).toHaveValue("foo");

  mockedUsePathname.mockReturnValue(undefined);
  mockGetSearchParams.mockReturnValue(undefined);
});

it("does not display any suggestion in case of KO response from the API", async () => {
  render(<HeaderSearchBarContainer />);

  // We need to start with a first successful request in order to trigger an
  // initial state change:
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  await typeSearchTerm("a");

  await waitFor(() => {
    screen.getByTestId("search-suggestions-list");
  });

  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=ab`,
    JSON.stringify({}),
    { status: 400 },
  );

  await typeSearchTerm("b");

  await waitFor(() => {
    expect(screen.queryByTestId("search-suggestions-list")).toBeNull();
  });
});

it("does not display any suggestion in case of fetch error", async () => {
  render(<HeaderSearchBarContainer />);

  // We need to start with a first successful request in order to trigger an
  // initial state change:
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  await typeSearchTerm("a");

  await waitFor(() => {
    screen.getByTestId("search-suggestions-list");
  });

  fetchMock.mockRejectOnce(new Error("Network failure"));

  await typeSearchTerm("b");

  await waitFor(() => {
    expect(screen.queryByTestId("search-suggestions-list")).toBeNull();
  });
});

it("fetches only once if two characters are typed within debounce time", async () => {
  render(<HeaderSearchBarContainer />);

  await clickSearchInput();

  jest.useFakeTimers();

  userEvent.keyboard("a"); // Using `await` here would make the test time out, because of the `jest.useFakeTimers();`

  jest.advanceTimersByTime(AUTOCOMPLETE_DEBOUNCE_TIME_MS / 2);

  userEvent.keyboard("b"); // Using `await` here would make the test time out, because of the `jest.useFakeTimers();`

  jest.useRealTimers();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    );
  });
});

it("fetches twice if two characters are typed beyond debounce time", async () => {
  render(<HeaderSearchBarContainer />);

  await clickSearchInput();

  jest.useFakeTimers();

  userEvent.keyboard("a"); // Using `await` here would make the test time out, because of the `jest.useFakeTimers();`

  await waitFor(() => {
    expect(fetch).toHaveBeenLastCalledWith(
      `${API_ROUTE_SEARCH_SUGGESTIONS}?search=a`,
    );
  });

  jest.advanceTimersByTime(AUTOCOMPLETE_DEBOUNCE_TIME_MS * 2);

  userEvent.keyboard("b"); // Using `await` here would make the test time out, because of the `jest.useFakeTimers();`

  await waitFor(() => {
    expect(fetch).toHaveBeenLastCalledWith(
      `${API_ROUTE_SEARCH_SUGGESTIONS}?search=ab`,
    );
  });

  jest.useRealTimers();
});
