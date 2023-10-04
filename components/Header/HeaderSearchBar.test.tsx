import "@testing-library/jest-dom/extend-expect";
import en from "@/messages/en.json";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderSearchBar from "./HeaderSearchBar";

const labels = en.HomePageAuthenticated.Header.SearchBar;

it("should reset value and blur search input upon pressing Escape", async () => {
  render(<HeaderSearchBar labels={labels} />);

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.type(searchInput, "abc");

  expect(searchInput).toHaveValue("abc");

  userEvent.keyboard("[Escape]");

  await waitFor(() => {
    expect(searchInput).toHaveValue("");
  });
});

it("should hide icon when focusing the input", async () => {
  render(<HeaderSearchBar labels={labels} />);

  screen.getByTestId("search-bar-icon");

  const searchInput = screen.getByTestId("search-bar-input");

  await userEvent.click(searchInput);

  expect(screen.queryByTestId("search-bar-icon")).toBeNull();
});
