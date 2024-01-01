import { AccountsContext } from "@/contexts/AccountsContext";
import { TypesOfAccount } from "@/lib/types";
import en from "@/messages/en.json";
import { render, screen, waitFor, within } from "@testing-library/react";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { AccountDisplayProps } from "./AccountDisplay";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";
import { ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY } from "@/lib/constants";

const messages = en.HeaderAuthenticated;

jest.mock("@/components/LogoutTrigger/LogoutTrigger", () => {
  const MockedLogoutTrigger = () => <div data-testid="mock-logout-trigger" />;

  MockedLogoutTrigger.displayName = "LogoutTrigger";

  return MockedLogoutTrigger;
});

jest.mock("@/components/Header/AccountDisplay", () => {
  const MockedAccountDisplay = ({
    account,
    isActive,
    onClick,
  }: AccountDisplayProps) => (
    <div
      onClick={onClick}
      data-testid={isActive ? "account-display-active" : ""}
    >
      {account.displayName}
    </div>
  );

  MockedAccountDisplay.displayName = "AccountDisplay";

  return MockedAccountDisplay;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
}));

const mockSetActiveAccountUsername = jest.fn();

const defaultMockAccountsContext = {
  accounts: [
    {
      username: "johndoe",
      type: TypesOfAccount.PERSONAL,
      displayName: "John Doe",
      initial: "J",
      profilePictureURL: "https://profile.picture.url",
    },
    {
      username: "johnbiz",
      type: TypesOfAccount.BUSINESS,
      displayName: "John's Business",
      initial: "J",
      profilePictureURL: "https://profile.picture.url",
    },
  ],
  setAccounts: jest.fn(),
  isFetchingAccounts: false,
  setIsFetchingAccounts: jest.fn(),
  isErrorFetchingAccounts: false,
  setIsErrorFetchingAccounts: jest.fn(),
  activeAccountUsername: "johnbiz",
  setActiveAccountUsername: mockSetActiveAccountUsername,
};

const renderComponent = (
  { mockAccountsContext } = { mockAccountsContext: defaultMockAccountsContext },
) => {
  render(
    <AccountsContext.Provider value={mockAccountsContext}>
      <AccountOptionsFlyout />
    </AccountsContext.Provider>,
  );
};

it("should display spinner while fetching", () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    isFetchingAccounts: true,
  };

  renderComponent({ mockAccountsContext });

  screen.getByTestId("owned-accounts-spinner");
});

it("should not display 'Your other accounts' section in case of a single account", () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    accounts: [defaultMockAccountsContext.accounts[0]],
  };

  renderComponent({ mockAccountsContext });

  expect(screen.queryByText(messages.YOUR_OTHER_ACCOUNTS)).toBeNull();
});

it("should display active account and 'Your other accounts' section if fetch response has two accounts", () => {
  renderComponent();

  const currentlyInSection = screen.getByTestId("currently-in-section");
  expect(currentlyInSection).toHaveTextContent("John's Business");
  within(currentlyInSection).getByTestId("account-display-active");

  const otherAccountsSection = screen.getByTestId("other-accounts-section");
  expect(otherAccountsSection).toHaveTextContent("John Doe");
  expect(
    within(otherAccountsSection).queryByTestId("account-display-active"),
  ).toBeNull();
});

it("should display first account as active account if active account username matches no account", () => {
  renderComponent({
    mockAccountsContext: {
      ...defaultMockAccountsContext,
      activeAccountUsername: "someoneelse",
    },
  });

  const currentlyInSection = screen.getByTestId("currently-in-section");
  expect(currentlyInSection).toHaveTextContent("John Doe");

  const otherAccountsSection = screen.getByTestId("other-accounts-section");
  expect(otherAccountsSection).toHaveTextContent("John's Business");
});

it("should display error response in case of fetch error", () => {
  fetchMock.mockRejectOnce(new Error("Network failure"));

  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    isErrorFetchingAccounts: true,
  };

  renderComponent({ mockAccountsContext });

  screen.getByText(messages.ERROR_RETRIEVING_ACCOUNTS);
});

it("should switch accounts in context and set corresponding cookie when clicking on an inactive account", async () => {
  renderComponent();

  const inactiveAccount = screen.getByText("John Doe"); // the initially inactive account

  await userEvent.click(inactiveAccount);

  expect(mockSetActiveAccountUsername).toHaveBeenLastCalledWith("johndoe");

  expect(Cookies.set).toHaveBeenLastCalledWith(
    ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
    "johndoe",
  );
});

it("should render <LogoutTrigger /> upon clicking 'Log out'", async () => {
  renderComponent();

  expect(screen.queryByTestId("mock-logout-trigger")).toBeNull();

  const logoutButton = screen.getByTestId(
    "account-options-flyout-log-out-button",
  );

  await userEvent.click(logoutButton);

  screen.getByTestId("mock-logout-trigger");
});

it("should only display log out button when no account in context", async () => {
  renderComponent({
    mockAccountsContext: { ...defaultMockAccountsContext, accounts: [] },
  });

  screen.getByText(messages.LOG_OUT);

  expect(screen.queryByText(messages.CURRENTLY_IN)).toBeNull();
});
