import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toHaveTextContent()`
import { AccountsContext } from "@/contexts/AccountsContext";
import { TypesOfAccount } from "@/lib/types";
import en from "@/messages/en.json";
import { render, screen, within } from "@testing-library/react";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { AccountDisplayProps } from "./AccountDisplay";

const messages = en.HeaderAuthenticated;

jest.mock("@/components/LogoutTrigger/LogoutTrigger", () => {
  const MockedLogoutTrigger = () => <div data-testid="mock-logout-trigger" />;

  MockedLogoutTrigger.displayName = "LogoutTrigger";

  return MockedLogoutTrigger;
});

jest.mock("@/components/Header/AccountDisplay", () => {
  const MockedAccountDisplay = ({ account, isActive }: AccountDisplayProps) => (
    <div data-testid={isActive ? "account-display-active" : ""}>
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
      <AccountOptionsFlyout />
    </AccountsContext.Provider>,
  );
};

it("should display spinner while fetching", async () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    isFetchingAccounts: true,
  };

  renderComponent({ mockAccountsContext });

  screen.getByTestId("owned-accounts-spinner");
});

it("should display not display 'Your other accounts' section in case of a single account", async () => {
  renderComponent();

  expect(screen.queryByText(messages.YOUR_OTHER_ACCOUNTS)).toBeNull();
});

it("should display active account and 'Your other accounts' section if fetch response has two accounts", async () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    accounts: [
      ...defaultMockAccountsContext.accounts,
      {
        username: "johndoebiz",
        type: TypesOfAccount.BUSINESS,
        displayName: "John's Business",
        initial: "J",
        profilePictureURL: "https://profile.picture.url",
      },
    ],
  };

  renderComponent({ mockAccountsContext });

  const currentlyInSection = screen.getByTestId("currently-in-section");
  expect(currentlyInSection).toHaveTextContent("John Doe");
  within(currentlyInSection).getByTestId("account-display-active");

  const otherAccountsSection = screen.getByTestId("other-accounts-section");
  expect(otherAccountsSection).toHaveTextContent("John's Business");
  expect(
    within(otherAccountsSection).queryByTestId("account-display-active"),
  ).toBeNull();
});

it("should display error response in case of fetch error", async () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    isErrorFetchingAccounts: true,
  };

  renderComponent({ mockAccountsContext });

  screen.getByText(messages.ERROR_RETRIEVING_ACCOUNTS);
});
