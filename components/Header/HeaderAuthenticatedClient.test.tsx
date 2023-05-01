import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";

const messagesEn = en.HomePageAuthenticated;

const userDetails = {
  email: "john.doe@example.com",
  initial: "J",
  firstName: "John",
  lastName: "Doe",
};

describe("HeaderAuthenticated", () => {
  it("should have the proper interactivity", async () => {
    const user = userEvent.setup();

    render(<HeaderAuthenticatedClient userDetails={userDetails} labels={messagesEn} />);

    const createButton = screen.getByText(messagesEn.CREATE);
    const searchBar = screen.getByPlaceholderText(messagesEn.PLACEHOLDER_SEARCH);
    const profileLink = screen.getByTestId("profile-link");
    const accountOptionsButton = screen.getByTestId("account-options-button");

    // Create button:
    expect(screen.queryByText(messagesEn.CREATE_PIN)).toBeNull();
    await user.click(createButton);
    screen.getByText(messagesEn.CREATE_PIN);
    await user.click(createButton);
    expect(screen.queryByText(messagesEn.CREATE_PIN)).toBeNull();

    // Search bar:
    screen.getByTestId("search-bar-icon");
    await user.click(searchBar);
    expect(screen.queryByTestId("search-bar-icon")).toBeNull();

    // Profile link:
    expect(screen.queryByText(messagesEn.YOUR_PROFILE)).toBeNull();
    fireEvent.mouseEnter(profileLink);
    screen.getByText(messagesEn.YOUR_PROFILE);
    fireEvent.mouseLeave(profileLink);
    expect(screen.queryByText(messagesEn.YOUR_PROFILE)).toBeNull();

    // Account options button:
    expect(screen.queryByText(messagesEn.ACCOUNT_OPTIONS)).toBeNull();
    fireEvent.mouseEnter(accountOptionsButton);
    screen.getByText(messagesEn.ACCOUNT_OPTIONS);
    fireEvent.mouseLeave(accountOptionsButton);
    expect(screen.queryByText(messagesEn.ACCOUNT_OPTIONS)).toBeNull();

    expect(screen.queryByText(messagesEn.LOG_OUT)).toBeNull();
    await user.click(accountOptionsButton);
    screen.getByText(messagesEn.LOG_OUT);
    await user.click(accountOptionsButton);
    expect(screen.queryByText(messagesEn.LOG_OUT)).toBeNull();
  });
});
