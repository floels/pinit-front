import userEvent from "@testing-library/user-event";
import { screen, fireEvent, render } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedContainer from "./HeaderAuthenticatedContainer";
import { AccountsContext } from "@/contexts/AccountsContext";
import { TypesOfAccount } from "@/lib/types";

const messages = en.HeaderAuthenticated;

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

it("should have the proper interactivity", async () => {
  renderComponent();

  const profileLink = screen.getByTestId("profile-link");
  const accountOptionsButton = screen.getByTestId("account-options-button");

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
  await userEvent.click(accountOptionsButton);
  screen.getByText(messages.LOG_OUT);
  await userEvent.click(accountOptionsButton);
  expect(screen.queryByText(messages.LOG_OUT)).toBeNull();
});

it("should display spinner while fetching", async () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    isFetchingAccounts: true,
  };

  renderComponent({ mockAccountsContext });

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByTestId("owned-accounts-spinner");
});

it("should not display 'Your other accounts' section in case of a single account", async () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByText(messages.CURRENTLY_IN);
  screen.getByText("John Doe");
  screen.getByText("Personal");

  const profilePicture = screen.getByAltText(
    `${messages.ALT_PROFILE_PICTURE_OF} John Doe`,
  ) as HTMLImageElement;
  expect(profilePicture.src).toMatch(
    /_next\/image\?url=https%3A%2F%2Fprofile\.picture\.url/,
  ); // Since the `src` attribute is transformed by the use of <Image /> from 'next/image'

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
        displayName: "John Doe's Business",
        initial: "J",
        profilePictureURL: "https://profile.picture.url",
      },
    ],
  };

  renderComponent({ mockAccountsContext });

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  // TODO: check that first account is rendered and marked as active

  screen.getByText(messages.YOUR_OTHER_ACCOUNTS);
  screen.getByText("John Doe's Business");
  screen.getByText("Business");
});

it("should display error response in case of fetch error", async () => {
  const mockAccountsContext = {
    ...defaultMockAccountsContext,
    isErrorFetchingAccounts: true,
  };

  renderComponent({ mockAccountsContext });

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByText(messages.ERROR_RETRIEVING_ACCOUNTS);
});
