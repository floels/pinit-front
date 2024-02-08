import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import en from "@/messages/en.json";
import {
  ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
  API_ROUTE_OBTAIN_TOKEN,
} from "@/lib/constants";

const messages = en.LandingPageContent;

const onClickNoAccountYet = () => {}; // NB: this behavior will be tested in <HeaderUnauthenticatedClient />

const renderComponent = () => {
  render(<LoginForm onClickNoAccountYet={onClickNoAccountYet} />);
};

const mockRouterRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

it("should display relevant input errors and not send any request before all inputs are valid, and reload the page on successful response", async () => {
  renderComponent();

  screen.getByText(messages.LoginForm.WELCOME_TO_PINIT);

  const emailInput = screen.getByLabelText(messages.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.LoginForm.PASSWORD);
  const submitButton = screen.getByText(messages.LoginForm.LOG_IN);

  // Submit without any input:
  await userEvent.click(submitButton);

  screen.getByText(messages.LoginForm.MISSING_EMAIL);

  // Type in email input, clear it and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.clear(emailInput);
  await userEvent.click(submitButton);

  screen.getByText(messages.LoginForm.MISSING_EMAIL);

  // Fill form with invalid email and password and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.type(passwordInput, "Pa$$");
  await userEvent.click(submitButton);

  screen.getByText(messages.LoginForm.INVALID_EMAIL_INPUT);

  // Fix email but not password:
  await userEvent.type(emailInput, ".com");
  await userEvent.click(submitButton);

  expect(screen.queryByText(messages.LoginForm.INVALID_EMAIL_INPUT)).toBeNull();
  screen.getByText(messages.LoginForm.INVALID_PASSWORD_INPUT);

  // Fix password input:
  await userEvent.type(passwordInput, "w0rd");
  expect(
    screen.queryByText(messages.LoginForm.INVALID_PASSWORD_INPUT),
  ).toBeNull();
});

it("should set the access token's expiration date in local storage and reload the page upon successful response", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.LoginForm.PASSWORD);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");

  const ACCESS_TOKEN_EXPIRATION_DATE = "2024-04-12T14:30:00Z";

  fetchMock.mockOnceIf(
    API_ROUTE_OBTAIN_TOKEN,
    JSON.stringify({
      access_token_expiration_utc: ACCESS_TOKEN_EXPIRATION_DATE,
    }),
  );

  Object.defineProperty(window, "localStorage", {
    value: {
      setItem: jest.fn(),
    },
  });

  const submitButton = screen.getByText(messages.LoginForm.LOG_IN);
  await userEvent.click(submitButton);

  expect(window.localStorage.setItem).toHaveBeenLastCalledWith(
    ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    ACCESS_TOKEN_EXPIRATION_DATE,
  );

  expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
});

it("should display relevant errors when receiving KO responses", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.LoginForm.PASSWORD);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");

  fetchMock.mockOnceIf(
    API_ROUTE_OBTAIN_TOKEN,
    JSON.stringify({ errors: [{ code: "invalid_email" }] }),
    { status: 401 },
  );

  const submitButton = screen.getByText(messages.LoginForm.LOG_IN);
  await userEvent.click(submitButton);

  screen.getByText(messages.LoginForm.INVALID_EMAIL_LOGIN);

  fetchMock.mockOnceIf(
    API_ROUTE_OBTAIN_TOKEN,
    JSON.stringify({ errors: [{ code: "invalid_password" }] }),
    { status: 401 },
  );
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, "IsWr0ng");

  await userEvent.click(submitButton);
  screen.getByText(messages.LoginForm.INVALID_PASSWORD_LOGIN);

  fetchMock.mockOnceIf(API_ROUTE_OBTAIN_TOKEN, JSON.stringify({}), {
    status: 400,
  });
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, "IsRight");

  await userEvent.click(submitButton);
  screen.getByText(en.Common.UNFORESEEN_ERROR);
});

it("should display relevant error upon fetch error", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.LoginForm.PASSWORD);
  const submitButton = screen.getByText(messages.LoginForm.LOG_IN);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");

  fetchMock.mockRejectOnce(new Error("Network failure"));

  await userEvent.click(submitButton);

  screen.getByText(en.Common.CONNECTION_ERROR);
});

it("should display loading state while expecting network response", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.LoginForm.PASSWORD);
  const submitButton = screen.getByText(messages.LoginForm.LOG_IN);

  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.click(submitButton);

  screen.getByTestId("login-form-loading-overlay");
});
