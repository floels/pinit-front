import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm";
import en from "@/messages/en.json";
import { API_ROUTE_SIGN_UP } from "@/lib/constants";

const messages = en.LandingPageContent;

const onClickAlreadyHaveAccount = () => {}; // NB: this behavior will be tested in <HeaderUnauthenticatedClient />

const mockRouterRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

const renderComponent = () => {
  render(<SignupForm onClickAlreadyHaveAccount={onClickAlreadyHaveAccount} />);
};

it("should display relevant input errors, send request only when inputs are valid, and reload the page on successful response", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_SIGN_UP,
    JSON.stringify({ access: "access", refresh: "refresh" }),
  );

  renderComponent();

  screen.getByText(messages.SignupForm.FIND_NEW_IDEAS);

  const emailInput = screen.getByLabelText(messages.SignupForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.SignupForm.PASSWORD);
  const birthdateInput = screen.getByLabelText(messages.SignupForm.BIRTHDATE);
  const submitButton = screen.getByText(messages.SignupForm.CONTINUE);

  // Submit without any input:
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.MISSING_EMAIL);

  // Type in email input, clear it and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.clear(emailInput);
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.MISSING_EMAIL);

  // Fill form with invalid email, invalid pasword and missing birthdate and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.type(passwordInput, "Pa$$");
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.INVALID_EMAIL_INPUT);

  // Fix email input but not password input or birthdate:
  await userEvent.type(emailInput, ".com");
  await userEvent.click(submitButton);

  expect(
    screen.queryByText(messages.SignupForm.INVALID_EMAIL_INPUT),
  ).toBeNull();
  screen.getByText(messages.SignupForm.INVALID_PASSWORD_INPUT);

  // Fix password input but not birthdate:
  await userEvent.type(passwordInput, "w0rd");
  expect(
    screen.queryByText(messages.SignupForm.INVALID_PASSWORD_INPUT),
  ).toBeNull();
  await userEvent.click(submitButton);
  screen.getByText(messages.SignupForm.INVALID_BIRTHDATE_INPUT);

  // Enter inexistent birthdate:
  await userEvent.type(birthdateInput, "1970-02-31");
  await userEvent.click(submitButton);
  screen.getByText(messages.SignupForm.INVALID_BIRTHDATE_INPUT);

  // Enter birthdate in the future:
  await userEvent.clear(birthdateInput);
  await userEvent.type(birthdateInput, "2050-01-01");
  await userEvent.click(submitButton);
  screen.getByText(messages.SignupForm.INVALID_BIRTHDATE_INPUT);

  // Fix birthdate input:
  await userEvent.clear(birthdateInput);
  await userEvent.type(birthdateInput, "1970-01-01");
  expect(
    screen.queryByText(messages.SignupForm.INVALID_BIRTHDATE_INPUT),
  ).toBeNull();

  // Submit with correct inputs:
  await userEvent.click(submitButton);
  expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
});

it("should display relevant error when receiving KO responses", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.SignupForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.SignupForm.PASSWORD);
  const birthdateInput = screen.getByLabelText(messages.SignupForm.BIRTHDATE);
  const submitButton = screen.getByText(messages.SignupForm.CONTINUE);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.type(birthdateInput, "1970-01-01");

  fetchMock.doMockOnceIf(
    API_ROUTE_SIGN_UP,
    JSON.stringify({ errors: [{ code: "invalid_email" }] }),
    { status: 400 },
  );
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.INVALID_EMAIL_SIGNUP);

  fetchMock.doMockOnceIf(
    API_ROUTE_SIGN_UP,
    JSON.stringify({ errors: [{ code: "invalid_password" }] }),
    { status: 400 },
  );
  await userEvent.type(passwordInput, "IsWr0ng");
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.INVALID_PASSWORD_SIGNUP);

  fetchMock.doMockOnceIf(
    API_ROUTE_SIGN_UP,
    JSON.stringify({ errors: [{ code: "invalid_birthdate" }] }),
    { status: 400 },
  );
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, "IsRight");
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.INVALID_BIRTHDATE_SIGNUP);

  fetchMock.doMockOnceIf(
    API_ROUTE_SIGN_UP,
    JSON.stringify({ errors: [{ code: "email_already_signed_up" }] }),
    { status: 400 },
  );
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, "IsRight");
  await userEvent.click(submitButton);

  screen.getByText(messages.SignupForm.EMAIL_ALREADY_SIGNED_UP);

  fetchMock.doMockOnceIf(API_ROUTE_SIGN_UP, JSON.stringify({}), {
    status: 400,
  });
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, "IsRight");
  await userEvent.click(submitButton);

  screen.getByText(en.Common.UNFORESEEN_ERROR);
});

it("should display relevant error upon fetch error", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.SignupForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.SignupForm.PASSWORD);
  const birthdateInput = screen.getByLabelText(messages.SignupForm.BIRTHDATE);
  const submitButton = screen.getByText(messages.SignupForm.CONTINUE);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.type(birthdateInput, "1970-01-01");

  fetchMock.mockRejectOnce(new Error("Network failure"));

  await userEvent.click(submitButton);

  screen.getByText(en.Common.CONNECTION_ERROR);
});

it("should display loading state while expecting network response", async () => {
  renderComponent();

  const emailInput = screen.getByLabelText(messages.SignupForm.EMAIL);
  const passwordInput = screen.getByLabelText(messages.SignupForm.PASSWORD);
  const birthdateInput = screen.getByLabelText(messages.SignupForm.BIRTHDATE);
  const submitButton = screen.getByText(messages.SignupForm.CONTINUE);

  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.type(birthdateInput, "1970-01-01");
  await userEvent.click(submitButton);

  screen.getByTestId("signup-form-loading-overlay");
});
