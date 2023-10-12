import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import en from "@/messages/en.json";

const labels = {
  component: en.LandingPage.LoginForm,
  commons: en.Common,
};

const onClickNoAccountYet = () => {}; // this behavior will be tested in <HeaderUnauthenticatedClient />

const loginForm = (
  <LoginForm onClickNoAccountYet={onClickNoAccountYet} labels={labels} />
);

const mockRouterRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

it("should display relevant input errors, send request only when inputs are valid, and reload the page on successful response", async () => {
  // Inspired by https://stackoverflow.com/a/55771671
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload: jest.fn() },
  });

  fetchMock.doMockOnceIf(
    "/api/user/obtain-token",
    JSON.stringify({
      access_token: "accessToken",
      refresh_token: "refreshToken",
    }),
  );

  render(loginForm);

  screen.getByText(en.LandingPage.LoginForm.WELCOME_TO_PINIT);

  const emailInput = screen.getByLabelText(en.LandingPage.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(
    en.LandingPage.LoginForm.PASSWORD,
  );
  const submitButton = screen.getByText(en.LandingPage.LoginForm.LOG_IN);

  // Fill form with invalid email and pasword and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.type(passwordInput, "Pa$$");
  await userEvent.click(submitButton);

  screen.getByText(en.LandingPage.LoginForm.INVALID_EMAIL_INPUT);

  // Fix email but not password:
  await userEvent.type(emailInput, ".com");
  await userEvent.click(submitButton);

  expect(
    screen.queryByText(en.LandingPage.LoginForm.INVALID_EMAIL_INPUT),
  ).toBeNull();
  screen.getByText(en.LandingPage.LoginForm.INVALID_PASSWORD_INPUT);

  // Fix password input:
  await userEvent.type(passwordInput, "w0rd");
  expect(
    screen.queryByText(en.LandingPage.LoginForm.INVALID_PASSWORD_INPUT),
  ).toBeNull();

  // Submit with correct inputs:
  await userEvent.click(submitButton);
  expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
});

it("should display relevant errors when receiving 401 responses", async () => {
  render(loginForm);

  const emailInput = screen.getByLabelText(en.LandingPage.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(
    en.LandingPage.LoginForm.PASSWORD,
  );
  const submitButton = screen.getByText(en.LandingPage.LoginForm.LOG_IN);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");

  fetchMock.doMockOnceIf(
    "/api/user/obtain-token",
    JSON.stringify({ errors: [{ code: "invalid_email" }] }),
    { status: 401 },
  );
  await userEvent.click(submitButton);

  screen.getByText(en.LandingPage.LoginForm.INVALID_EMAIL_LOGIN);

  fetchMock.doMockOnceIf(
    "/api/user/obtain-token",
    JSON.stringify({ errors: [{ code: "invalid_password" }] }),
    { status: 401 },
  );
  await userEvent.type(passwordInput, "IsWr0ng");
  await userEvent.click(submitButton);

  screen.getByText(en.LandingPage.LoginForm.INVALID_PASSWORD_LOGIN);
});

it("should display loading state while expecting network response", async () => {
  render(loginForm);

  const emailInput = screen.getByLabelText(en.LandingPage.LoginForm.EMAIL);
  const passwordInput = screen.getByLabelText(
    en.LandingPage.LoginForm.PASSWORD,
  );
  const submitButton = screen.getByText(en.LandingPage.LoginForm.LOG_IN);

  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.click(submitButton);

  screen.getByTestId("loading-overlay");
});
