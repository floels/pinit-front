import "@testing-library/jest-dom/extend-expect";
import en from "@/messages/en.json";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderSearchBar from "./HeaderSearchBar";

const labels = en.HomePage.Header.SearchBar;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

it("should reset input value and blur input upon pressing Escape", async () => {
  render(<HeaderSearchBar labels={labels} />);

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
  render(<HeaderSearchBar labels={labels} />);

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
  render(<HeaderSearchBar labels={labels} />);

  screen.getByTestId("search-icon");

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);

  expect(screen.queryByTestId("search-icon")).toBeNull();
});

it("should display autocomplete suggestions when user types", async () => {
  const searchTerm = "foo";

  const numberSuggestions = 12;

  const dummySuggestions = Array.from(
    { length: numberSuggestions },
    (_, index) => `${searchTerm} suggestion ${index + 1}`,
  ); // so dummySuggestions === ["foo suggestion 1", "foo suggestion 2", ..., "foo suggestion 12"]

  fetchMock.mockOnceIf(
    `/api/pins/search/autocomplete?search=${searchTerm}`,
    JSON.stringify({ results: dummySuggestions }),
  );

  render(<HeaderSearchBar labels={labels} />);

  const searchInput = screen.getByTestId("search-bar-input");

  expect(screen.queryByTestId("autocomplete-suggestions-list")).toBeNull();

  await userEvent.click(searchInput);

  await userEvent.type(searchInput, searchTerm);

  await waitFor(() => {
    const autoCompleteSuggestionsList = screen.getByTestId(
      "autocomplete-suggestions-list",
    );

    const autoCompleteSuggestionsListItems = within(
      autoCompleteSuggestionsList,
    ).getAllByTestId("autocomplete-suggestions-list-item");

    expect(autoCompleteSuggestionsListItems).toHaveLength(numberSuggestions);

    // Check that the component inserted the search term as first suggestion:
    expect(autoCompleteSuggestionsListItems[0]).toHaveTextContent(searchTerm);
    expect(autoCompleteSuggestionsListItems[1]).toHaveTextContent(
      `${searchTerm} suggestion 1`,
    );
  });
});
