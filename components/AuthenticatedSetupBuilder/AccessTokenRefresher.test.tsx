import {
  ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
  API_ROUTE_REFRESH_TOKEN,
} from "@/lib/constants";
import { render, waitFor, screen } from "@testing-library/react";
import AccessTokenRefresher, {
  TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION,
} from "./AccessTokenRefresher";
import { MockLocalStorage, withQueryClient } from "@/lib/utils/testing";

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

const mockHandleFinishedFetching = jest.fn();

const renderComponent = () => {
  render(
    withQueryClient(
      <AccessTokenRefresher
        handleFinishedFetching={mockHandleFinishedFetching}
      />,
    ),
  );
};

(global.localStorage as any) = new MockLocalStorage();

beforeEach(() => {
  fetchMock.resetMocks();

  mockHandleFinishedFetching.mockReset();

  localStorage.clear();
});

it(`does not refresh access token, and calls 'handleFinishedFetching'
if expiration date is beyond buffer`, () => {
  const nowTime = new Date().getTime();

  const accessTokenExpirationDate = new Date(
    nowTime + 2 * TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION,
  );

  localStorage.setItem(
    ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    accessTokenExpirationDate.toISOString(),
  );

  renderComponent();

  expect(fetch).not.toHaveBeenCalled();

  expect(mockHandleFinishedFetching).toHaveBeenCalledTimes(1);
});

it(`refreshes access token, persists new expiration date
in local storage, and calls 'handleFinishedFetching' if no 
expiration date was found in local storage`, async () => {
  const expirationDateUTC = "2024-02-09T07:09:45+00:00";

  fetchMock.mockOnceIf(
    API_ROUTE_REFRESH_TOKEN,
    JSON.stringify({
      access_token_expiration_utc: expirationDateUTC,
    }),
  );

  renderComponent();

  await waitFor(() => {
    expect(
      localStorage.getItem(ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY),
    ).toEqual(expirationDateUTC);
  });

  expect(mockHandleFinishedFetching).toHaveBeenCalledTimes(1);
});

it("refreshes access token if invalid expiration date in local storage", () => {
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

it("refreshes access token if expiration date in local storage is within buffer", () => {
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

it(`triggers logout and calls 'handleFinishedFetching' upon 401 response
if no expiration date was found in local storage`, async () => {
  fetchMock.mockOnceIf(API_ROUTE_REFRESH_TOKEN, JSON.stringify({}), {
    status: 401,
  });

  renderComponent();

  await waitFor(() => {
    screen.getByTestId("mock-logout-trigger");

    expect(mockHandleFinishedFetching).toHaveBeenCalledTimes(1);
  });
});
