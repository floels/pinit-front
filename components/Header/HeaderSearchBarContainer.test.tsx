import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderSearchBarContainer, {
  AUTOCOMPLETE_DEBOUNCE_TIME_MS,
} from "./HeaderSearchBarContainer";
import { API_ROUTE_SEARCH_SUGGESTIONS } from "@/lib/constants";
import { HeaderSearchBarContextProvider } from "@/contexts/headerSearchBarContext";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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

const NUMBER_MOCK_SUGGESTIONS = 12;

const MOCK_SUGGESTIONS = Array.from(
  { length: NUMBER_MOCK_SUGGESTIONS },
  (_, index) => `foo suggestion ${index + 1}`,
); // i.e. ["foo suggestion 1", "foo suggestion 2", ..., "foo suggestion 12"]

const typeSearchTerm = async (searchTerm: string) => {
  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, searchTerm);
};

const clickSearchInput = async () => {
  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);
};

const renderComponent = () => {
  render(
    <HeaderSearchBarContextProvider>
      <HeaderSearchBarContainer />
    </HeaderSearchBarContextProvider>,
  );
};

beforeEach(() => {
  fetchMock.resetMocks();
});

it("resets input value and blur input upon pressing Escape", async () => {
  renderComponent();

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
  renderComponent();

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
  renderComponent();

  screen.getByTestId("search-icon");

  await clickSearchInput();

  expect(screen.queryByTestId("search-icon")).toBeNull();
});

it("displays search suggestions with search term as first suggestion", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  renderComponent();

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

it("displays search suggestions as such if search term is already among suggestions", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({
      results: [
        "foo",
        ...MOCK_SUGGESTIONS.slice(0, NUMBER_MOCK_SUGGESTIONS - 1),
      ],
    }),
  );

  renderComponent();

  await typeSearchTerm("foo");

  await waitFor(() => {
    const searchSuggestionsListItems = screen.getAllByTestId(
      "search-suggestions-list-item",
    );

    expect(searchSuggestionsListItems[0]).toHaveTextContent("foo");
    expect(searchSuggestionsListItems[1]).toHaveTextContent("foo suggestion 1");
  });
});

it("navigates to search route when user clicks suggestion", async () => {
  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foo`,
    JSON.stringify({ results: MOCK_SUGGESTIONS }),
  );

  renderComponent();

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

it("navigates to /search/pins route when user types and presses Enter", async () => {
  renderComponent();

  const searchInput = screen.getByTestId("search-bar-input");

  await typeSearchTerm("foo");

  await userEvent.keyboard("[Enter]");

  expect(mockPush).toHaveBeenLastCalledWith(`/search/pins?q=foo`);
});

it("does not display any suggestion in case of KO response from the API", async () => {
  renderComponent();

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

  fetchMock.mockOnceIf(
    `${API_ROUTE_SEARCH_SUGGESTIONS}?search=foobar`,
    JSON.stringify({}),
    { status: 400 },
  );

  await typeSearchTerm("bar");

  await waitFor(() => {
    expect(screen.queryByTestId("search-suggestions-list")).toBeNull();
  });
});

it("does not display any suggestion in case of fetch error", async () => {
  renderComponent();

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

it("fetches only once if two characters are typed within debounce time", async () => {
  renderComponent();

  await clickSearchInput();

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

  jest.useRealTimers();
});

it("fetches twice if two characters are typed beyond debounce time", async () => {
  renderComponent();

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
