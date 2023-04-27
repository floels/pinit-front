import { NextIntlProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticated from "./HeaderAuthenticated";

const headerAuthenticated = (
  <NextIntlProvider locale="en" messages={en}>
    <HeaderAuthenticated />
  </NextIntlProvider>
);

const messages = en.HomePageAuthenticated;

describe("HeaderAuthenticated", () => {
  it("should have the proper interactivity", async () => {
    const user = userEvent.setup();

    render(headerAuthenticated);

    const createButton = screen.getByText(messages.CREATE);
    const searchBar = screen.getByPlaceholderText(messages.PLACEHOLDER_SEARCH);
    const profileLink = screen.getByTestId("profile-link");
    const accountOptionsButton = screen.getByTestId("account-options-button");

    // Create button:
    expect(screen.queryByText(messages.CREATE_PIN)).toBeNull();
    await user.click(createButton);
    screen.getByText(messages.CREATE_PIN);
    await user.click(createButton);
    expect(screen.queryByText(messages.CREATE_PIN)).toBeNull();

    // Search bar:
    screen.getByTestId("search-bar-icon");
    await user.click(searchBar);
    expect(screen.queryByTestId("search-bar-icon")).toBeNull();

    // Profile link:
    expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();
    fireEvent.mouseEnter(profileLink);
    screen.getByText(messages.YOUR_PROFILE);
    fireEvent.mouseLeave(profileLink);
    expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();

    // Account options button:
    expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();
    fireEvent.mouseEnter(accountOptionsButton);
    screen.getByText(messages.ACCOUNT_OPTIONS);
    fireEvent.mouseLeave(accountOptionsButton);
    expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();

    expect(screen.queryByText(messages.LOG_OUT)).toBeNull();
    await user.click(accountOptionsButton);
    screen.getByText(messages.LOG_OUT);
    await user.click(accountOptionsButton);
    expect(screen.queryByText(messages.LOG_OUT)).toBeNull();
  });
});
