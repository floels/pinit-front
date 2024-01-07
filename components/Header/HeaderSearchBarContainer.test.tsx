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
  (_, index) => `foo suggestion ${index + 1}`,
); // i.e. ["foo suggestion 1", "foo suggestion 2", ..., "foo suggestion 12"]

const typeSearchTerm = async (searchTerm: string) => {
  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, searchTerm);
};

beforeEach(() => {
  fetchMock.resetMocks();
});

it("should reset input value and blur input upon pressing Escape", async () => {
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

it("should reset input value, blur input and hide 'Clear' icon upon pressing 'Clear' icon", async () => {
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

it("should hide icon when input gets focus", async () => {
  render(<HeaderSearchBarContainer />);

  screen.getByTestId("search-icon");

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);

  expect(screen.queryByTestId("search-icon")).toBeNull();
});

it("should display search suggestions with search term as first suggestion", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("foo");

  await waitFor(() => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    expect(searchSuggestionsListItems).toHaveLength(NUMBER_MOCK_SUGGESTIONS);

    expect(searchSuggestionsListItems[0]).toHaveTextContent("foo");
    expect(searchSuggestionsListItems[1]).toHaveTextContent("foo suggestion 1");
  });
});

it("should display search suggestions as such if search term is already among suggestions", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({
      results: [
        "foo",
        ...MOCK_SUGGESTIONS.slice(0, NUMBER_MOCK_SUGGESTIONS - 1),
      ],
    }),
  );

  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("foo");

  await waitFor(() => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    expect(searchSuggestionsListItems[0]).toHaveTextContent("foo");
    expect(searchSuggestionsListItems[1]).toHaveTextContent("foo suggestion 1");
  });
});

it("should navigate to search route when user clicks suggestion", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  render(<HeaderSearchBarContainer />);

  await typeSearchTerm("foo");

  await waitFor(async () => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    await userEvent.click(searchSuggestionsListItems[1]);

    expect(mockPush).toHaveBeenLastCalledWith(
      `/search/pins?q=foo suggestion 1`,
    );
  });
});

it("should navigate to /search/pins route when user types and presses Enter", async () => {
  render(<HeaderSearchBarContainer />);

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);
  await userEvent.type(searchInput, "foo");
  await userEvent.keyboard("[Enter]");

  expect(mockPush).toHaveBeenLastCalledWith(`/search/pins?q=foo`);
});

it("should set the input value based on the search param", async () => {
  mockedUsePathname.mockReturnValue("/search/pins");
  mockGetSearchParams.mockReturnValue("foo");

  render(<HeaderSearchBarContainer />);

  const searchInput = screen.getByTestId("search-bar-input");
  expect(searchInput).toHaveValue("foo");

  mockedUsePathname.mockReturnValue(undefined);
  mockGetSearchParams.mockReturnValue(undefined);
});

it("should not display any suggestion in case of KO response from the API", async () => {
  render(<HeaderSearchBarContainer />);

  // We need to start with a first successful request in order to trigger an
  // initial state change:
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  await typeSearchTerm("foo");

  await waitFor(() => {
    screen.getByTestId("search-suggestions-list");
  });

  fetchMock.doMockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foobar`,
    JSON.stringify({}),
    { status: 400 },
  );

  await typeSearchTerm("bar");

  await waitFor(() => {
    expect(screen.queryByTestId("search-suggestions-list")).toBeNull();
  });
});

it("should not display any suggestion in case of fetch error", async () => {
  render(<HeaderSearchBarContainer />);

  // We need to start with a first successful request in order to trigger an
  // initial state change:
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  await typeSearchTerm("foo");

  await waitFor(() => {
    screen.getByTestId("search-suggestions-list");
  });

  fetchMock.mockRejectOnce(new Error("Network failure"));

  await typeSearchTerm("bar");

  await waitFor(() => {
    expect(screen.queryByTestId("search-suggestions-list")).toBeNull();
  });
});

it("should fetch only once if two characters are typed within debounce time", async () => {
  render(<HeaderSearchBarContainer />);

  const searchInput = screen.getByTestId("search-bar-input");
  await userEvent.click(searchInput);

  jest.useFakeTimers();

  userEvent.keyboard("a"); // Using `await` here would make the test time out, because of the `jest.useFakeTimers();`

  jest.advanceTimersByTime(AUTOCOMPLETE_DEBOUNCE_TIME_MS / 2);

  userEvent.keyboard("b"); // Using `await` here would make the test time out, because of the `jest.useFakeTimers();`

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      `${API_ROUTE_SEARCH_SUGGESTIONS}?search=ab`,
    );
  });

  jest.clearAllTimers();
  jest.useRealTimers();
});

it("should fetch twice if two characters are typed beyond debounce time", async () => {
  render(<HeaderSearchBarContainer />);

  const searchInput = screen.getByTestId("search-bar-input");
  await userEvent.click(searchInput);

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

  jest.clearAllTimers();
  jest.useRealTimers();
});
