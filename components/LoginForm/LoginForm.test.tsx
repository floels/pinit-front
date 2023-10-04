import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import LoginForm from "./LoginForm";
import en from "@/messages/en.json";

const COMPONENT_LABELS = en.HomePageUnauthenticated.LoginForm;
const labels = {
  component: COMPONENT_LABELS,
  commons: en.Common,
};

const onClickNoAccountYet = () => {}; // this behavior will be tested in <HomePageUnauthenticated />

const loginForm = (
  <LoginForm onClickNoAccountYet={onClickNoAccountYet} labels={labels} />
);

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

  screen.getByText(COMPONENT_LABELS.WELCOME_TO_PINIT);

  const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
  const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
  const submitButton = screen.getByText(COMPONENT_LABELS.LOG_IN);

  // Fill form with invalid email and pasword and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.type(passwordInput, "Pa$$");
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_EMAIL_INPUT);

  // Fix email but not password:
  await userEvent.type(emailInput, ".com");
  await userEvent.click(submitButton);

  expect(screen.queryByText(COMPONENT_LABELS.INVALID_EMAIL_INPUT)).toBeNull();
  screen.getByText(COMPONENT_LABELS.INVALID_PASSWORD_INPUT);

  // Fix password input:
  await userEvent.type(passwordInput, "w0rd");
  expect(
    screen.queryByText(COMPONENT_LABELS.INVALID_PASSWORD_INPUT),
  ).toBeNull();

  // Submit with correct inputs:
  await userEvent.click(submitButton);
  expect(window.location.reload).toHaveBeenCalledTimes(1);
});

it("should display relevant errors when receiving 401 responses", async () => {
  render(loginForm);

  const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
  const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
  const submitButton = screen.getByText(COMPONENT_LABELS.LOG_IN);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");

  fetchMock.doMockOnceIf(
    "/api/user/obtain-token",
    JSON.stringify({ errors: [{ code: "invalid_email" }] }),
    { status: 401 },
  );
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_EMAIL_LOGIN);

  fetchMock.doMockOnceIf(
    "/api/user/obtain-token",
    JSON.stringify({ errors: [{ code: "invalid_password" }] }),
    { status: 401 },
  );
  await userEvent.type(passwordInput, "IsWr0ng");
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_PASSWORD_LOGIN);
});

it("should display loading state while expecting network response", async () => {
  render(loginForm);

  const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
  const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
  const submitButton = screen.getByText(COMPONENT_LABELS.LOG_IN);

  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.click(submitButton);

  screen.getByTestId("loading-overlay");
});
