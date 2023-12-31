import {
  ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
  API_ROUTE_OWNED_ACCOUNTS,
  API_ROUTE_REFRESH_TOKEN,
} from "@/lib/constants";
import { render, screen, waitFor } from "@testing-library/react";
import AuthenticatedSetupBuilder from "./AuthenticatedSetupBuilder";
import { AccountsContext } from "@/contexts/AccountsContext";
import { withQueryClient } from "@/lib/utils/testing";
import { TypesOfAccount } from "@/lib/types";
import Cookies from "js-cookie";
import { getAccountsWithCamelCaseKeys } from "@/lib/utils/adapters";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock("@/components/LogoutTrigger/LogoutTrigger", () => {
  const MockedLogoutTrigger = () => <div data-testid="mock-logout-trigger" />;

  MockedLogoutTrigger.displayName = "LogoutTrigger";

  return MockedLogoutTrigger;
});

const mockSetAccounts = jest.fn();

const initialAccountsContext = {
  accounts: null,
  setAccounts: mockSetAccounts,
  isFetchingAccounts: false,
  setIsFetchingAccounts: jest.fn(),
  isErrorFetchingAccounts: false,
  setIsErrorFetchingAccounts: jest.fn(),
  activeAccountUsername: null,
  setActiveAccountUsername: jest.fn(),
};

const renderComponent = () => {
  render(
    <AccountsContext.Provider value={initialAccountsContext}>
      {withQueryClient(<AuthenticatedSetupBuilder />)}
    </AccountsContext.Provider>,
  );
};

it("should refresh access token", () => {
  renderComponent();

  expect(fetch).toHaveBeenLastCalledWith(
    API_ROUTE_REFRESH_TOKEN,
    expect.objectContaining({
      method: "POST",
    }),
  );
});

it("in the absence of a cookie, should fetch owned accounts and set active account cookie", async () => {
  fetchMock.mockOnceIf(API_ROUTE_REFRESH_TOKEN, JSON.stringify({}));

  const mockAccounts = [
    {
      username: "johndoe",
      type: TypesOfAccount.PERSONAL,
      display_name: "John Doe",
      initial: "J",
      profile_picture_url: "https://profile.picture.url",
    },
  ];

  fetchMock.mockOnceIf(
    API_ROUTE_OWNED_ACCOUNTS,
    JSON.stringify({
      results: mockAccounts,
    }),
  );

  renderComponent();

  const mockAccountsWithCamelizedKeys =
    getAccountsWithCamelCaseKeys(mockAccounts);

  await waitFor(() => {
    expect(mockSetAccounts).toHaveBeenLastCalledWith(
      mockAccountsWithCamelizedKeys,
    );

    expect(Cookies.set).toHaveBeenLastCalledWith(
      ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
      "johndoe",
    );
  });
});

it("should fetch owned accounts even upon failed refresh of access token", async () => {
  fetchMock.doMockOnceIf(API_ROUTE_REFRESH_TOKEN, JSON.stringify({}), {
    status: 500,
  });

  renderComponent();

  await waitFor(() => {
    expect(fetch).toHaveBeenLastCalledWith(API_ROUTE_OWNED_ACCOUNTS);
  });
});

it("should log out in case of 401 response upon token refresh", async () => {
  fetchMock.doMockOnceIf(API_ROUTE_REFRESH_TOKEN, JSON.stringify({}), {
    status: 401,
  });

  renderComponent();

  await waitFor(() => {
    screen.getByTestId("mock-logout-trigger");
  });
});
