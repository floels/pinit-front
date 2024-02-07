import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, fireEvent, render } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedContainer from "./HeaderAuthenticatedContainer";
import { AccountsContext } from "@/contexts/accountsContext";
import { TypesOfAccount } from "@/lib/types";

const messages = en.HeaderAuthenticated;

jest.mock("@/components/Header/AccountOptionsFlyout", () => {
  const MockedAccountOptionsFlyout = React.forwardRef(() => (
    <div data-testid="mock-account-options-flyout" />
  ));

  MockedAccountOptionsFlyout.displayName = "AccountOptionsFlyout";

  return MockedAccountOptionsFlyout;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const defaultMockAccountsContext = {
  accounts: [
    {
      username: "johndoe",
      type: TypesOfAccount.PERSONAL,
      displayName: "John Doe",
      initial: "J",
      profilePictureURL: "https://profile.picture.url",
    },
  ],
  setAccounts: jest.fn(),
  isFetchingAccounts: false,
  setIsFetchingAccounts: jest.fn(),
  isErrorFetchingAccounts: false,
  setIsErrorFetchingAccounts: jest.fn(),
  activeAccountUsername: "johndoe",
  setActiveAccountUsername: jest.fn(),
};

const renderComponent = (
  { mockAccountsContext } = { mockAccountsContext: defaultMockAccountsContext },
) => {
  render(
    <AccountsContext.Provider value={mockAccountsContext}>
      <HeaderAuthenticatedContainer />
    </AccountsContext.Provider>,
  );
};

it("should display tooltip for profile link upon hover", () => {
  renderComponent();

  const profileLink = screen.getByTestId("profile-link");

  expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();

  fireEvent.mouseEnter(profileLink);
  screen.getByText(messages.YOUR_PROFILE);

  fireEvent.mouseLeave(profileLink);
  expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();
});

it("should display tooltip for account options button upon hover", () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");

  expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();

  fireEvent.mouseEnter(accountOptionsButton);
  screen.getByText(messages.ACCOUNT_OPTIONS);

  fireEvent.mouseLeave(accountOptionsButton);
  expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();
});

it("should display account options flyout upon click on corresponding button, and close upon hitting Escape key", async () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();

  await userEvent.click(accountOptionsButton);

  screen.getByTestId("mock-account-options-flyout");

  await userEvent.keyboard("[Escape]");

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();
});

it("should close account options button when clicking out", async () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");

  await userEvent.click(accountOptionsButton);

  screen.getByTestId("mock-account-options-flyout");

  fireEvent.mouseDown(document.body);

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();
});
