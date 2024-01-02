import {
  ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
  ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
  API_ROUTE_OWNED_ACCOUNTS,
  API_ROUTE_REFRESH_TOKEN,
} from "@/lib/constants";
import { render, screen, waitFor } from "@testing-library/react";
import AuthenticatedSetupBuilder, {
  TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION,
} from "./AuthenticatedSetupBuilder";
import { AccountsContext } from "@/contexts/AccountsContext";
import { MockLocalStorage, withQueryClient } from "@/lib/utils/testing";
import { TypesOfAccount } from "@/lib/types";
import Cookies from "js-cookie";
import { getAccountsWithCamelCaseKeys } from "@/lib/utils/adapters";
import { FetchMock } from "jest-fetch-mock";

jest.mock("js-cookie");

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
const mockSetActiveAccountUsername = jest.fn();

const initialAccountsContext = {
  accounts: null,
  setAccounts: mockSetAccounts,
  isFetchingAccounts: false,
  setIsFetchingAccounts: jest.fn(),
  isErrorFetchingAccounts: false,
  setIsErrorFetchingAccounts: jest.fn(),
  activeAccountUsername: null,
  setActiveAccountUsername: mockSetActiveAccountUsername,
};

const renderComponent = () => {
  render(
    <AccountsContext.Provider value={initialAccountsContext}>
      {withQueryClient(<AuthenticatedSetupBuilder />)}
    </AccountsContext.Provider>,
  );
};

(global.localStorage as any) = new MockLocalStorage();

beforeEach(() => {
  fetchMock.resetMocks();
  localStorage.clear();
});

it("should not refresh access token if expiration date is beyond buffer", () => {
  const nowTime = new Date().getTime();

  const accessTokenExpirationDate = new Date(
    nowTime + 2 * TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION,
  );

  localStorage.setItem(
    ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    accessTokenExpirationDate.toISOString(),
  );

  renderComponent();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect((fetch as FetchMock).mock.calls[0]).toEqual([
    "/api/user/owned-accounts",
  ]);
});

it("should refresh access token if no expiration date in local storage", () => {
  renderComponent();

  expect(fetch).toHaveBeenCalledWith(
    API_ROUTE_REFRESH_TOKEN,
    expect.objectContaining({
      method: "POST",
    }),
  );
});

it("should refresh access token if invalid expiration date in local storage", () => {
  localStorage.setItem(
    ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    "20-10-03",
  );

  renderComponent();

  expect(fetch).toHaveBeenCalledWith(
    API_ROUTE_REFRESH_TOKEN,
    expect.objectContaining({
      method: "POST",
    }),
  );
});

it("should refresh access token if expiration date in local storage is within buffer", () => {
  const nowTime = new Date().getTime();

  const accessTokenExpirationDate = new Date(
    nowTime + TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION / 2,
  );

  localStorage.setItem(
    ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    accessTokenExpirationDate.toISOString(),
  );

  renderComponent();

  expect(fetch).toHaveBeenCalledWith(
    API_ROUTE_REFRESH_TOKEN,
    expect.objectContaining({
      method: "POST",
    }),
  );
});

it(`in the absence of an active account cookie and when receiving only one owned account,
should define it as active and set the corresponding cookie`, async () => {
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

    expect(mockSetActiveAccountUsername).toHaveBeenLastCalledWith("johndoe");

    expect(Cookies.set).toHaveBeenLastCalledWith(
      ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
      "johndoe",
    );
  });
});

it(`in the presence of an active account cookie and when receiving
two accounts including one matching the cookie,
should define it as active account`, async () => {
  (Cookies.get as jest.Mock).mockImplementationOnce((key) => {
    if (key === ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY) {
      return "johnbiz";
    }
    return null;
  });

  fetchMock.mockOnceIf(API_ROUTE_REFRESH_TOKEN, JSON.stringify({}));

  const mockAccounts = [
    {
      username: "johndoe",
      type: TypesOfAccount.PERSONAL,
      display_name: "John Doe",
      initial: "J",
      profile_picture_url: "https://profile.picture.url",
    },
    {
      username: "johnbiz",
      type: TypesOfAccount.BUSINESS,
      display_name: "John's Business",
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

  await waitFor(() => {
    expect(mockSetActiveAccountUsername).toHaveBeenLastCalledWith("johnbiz");
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
