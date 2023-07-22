import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";
import { AccountType } from "@/app/[locale]/page";

const labels = en.HomePageAuthenticated.Header;

const accounts = [
  {
    type: "personal",
    username: "johndoe",
    displayName: "John Doe",
    initial: "J",
    ownerEmail: "john.doe@example.com",
  },
] as AccountType[];

describe("HeaderAuthenticated", () => {
  it("should have the proper interactivity", async () => {
    const user = userEvent.setup();

    render(<HeaderAuthenticatedClient accounts={accounts} labels={labels} />);

    const createButton = screen.getByText(labels.CREATE);
    const searchBar = screen.getByPlaceholderText(labels.PLACEHOLDER_SEARCH);
    const profileLink = screen.getByTestId("profile-link");
    const accountOptionsButton = screen.getByTestId("account-options-button");

    // Create button:
    expect(screen.queryByText(labels.CREATE_PIN)).toBeNull();
    await user.click(createButton);
    screen.getByText(labels.CREATE_PIN);
    await user.click(createButton);
    expect(screen.queryByText(labels.CREATE_PIN)).toBeNull();

    // Search bar:
    screen.getByTestId("search-bar-icon");
    await user.click(searchBar);
    expect(screen.queryByTestId("search-bar-icon")).toBeNull();

    // Profile link:
    expect(screen.queryByText(labels.YOUR_PROFILE)).toBeNull();
    fireEvent.mouseEnter(profileLink);
    screen.getByText(labels.YOUR_PROFILE);
    fireEvent.mouseLeave(profileLink);
    expect(screen.queryByText(labels.YOUR_PROFILE)).toBeNull();

    // Account options button:
    expect(screen.queryByText(labels.ACCOUNT_OPTIONS)).toBeNull();
    fireEvent.mouseEnter(accountOptionsButton);
    screen.getByText(labels.ACCOUNT_OPTIONS);
    fireEvent.mouseLeave(accountOptionsButton);
    expect(screen.queryByText(labels.ACCOUNT_OPTIONS)).toBeNull();

    expect(screen.queryByText(labels.AccountOptionsFlyout.LOG_OUT)).toBeNull();
    await user.click(accountOptionsButton);
    screen.getByText(labels.AccountOptionsFlyout.LOG_OUT);
    await user.click(accountOptionsButton);
    expect(screen.queryByText(labels.AccountOptionsFlyout.LOG_OUT)).toBeNull();
  });
});
