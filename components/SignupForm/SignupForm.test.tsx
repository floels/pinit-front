import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm";
import en from "@/messages/en.json";

const COMPONENT_LABELS = en.HomePageUnauthenticated.SignupForm;
const labels = {
  component: COMPONENT_LABELS,
  commons: en.Common,
};

const onClickAlreadyHaveAccount = () => {}; // this behavior will be tested in <HomePageUnauthenticated />

const signupForm = (
  <SignupForm
    onClickAlreadyHaveAccount={onClickAlreadyHaveAccount}
    labels={labels}
  />
);

it("should display relevant input errors, send request only when inputs are valid, and reload the page on successful response", async () => {
  // Inspired by https://stackoverflow.com/a/55771671
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload: jest.fn() },
  });

  fetchMock.doMockOnceIf(
    "/api/user/sign-up",
    JSON.stringify({ access: "access", refresh: "refresh" }),
  );

  render(signupForm);

  screen.getByText(COMPONENT_LABELS.FIND_NEW_IDEAS);

  const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
  const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
  const birthdateInput = screen.getByLabelText(COMPONENT_LABELS.BIRTHDATE);
  const submitButton = screen.getByText(COMPONENT_LABELS.CONTINUE);

  // Fill form with invalid email, invalid pasword and missing birthdate and submit:
  await userEvent.type(emailInput, "test@example");
  await userEvent.type(passwordInput, "Pa$$");
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_EMAIL_INPUT);

  // Fix email input but not password input or birthdate:
  await userEvent.type(emailInput, ".com");
  await userEvent.click(submitButton);

  expect(screen.queryByText(COMPONENT_LABELS.INVALID_EMAIL_INPUT)).toBeNull();
  screen.getByText(COMPONENT_LABELS.INVALID_PASSWORD_INPUT);

  // Fix password input but not birthdate:
  await userEvent.type(passwordInput, "w0rd");
  expect(
    screen.queryByText(COMPONENT_LABELS.INVALID_PASSWORD_INPUT),
  ).toBeNull();
  screen.getByText(COMPONENT_LABELS.INVALID_BIRTHDATE_INPUT);

  // Fix birthdate ipnut:
  await userEvent.type(birthdateInput, "1970-01-01");
  expect(
    screen.queryByText(COMPONENT_LABELS.INVALID_BIRTHDATE_INPUT),
  ).toBeNull();

  // Submit with correct inputs:
  await userEvent.click(submitButton);
  expect(window.location.reload).toHaveBeenCalledTimes(1);
});

it("should display relevant error when receiving a 400 response", async () => {
  render(signupForm);

  const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
  const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
  const birthdateInput = screen.getByLabelText(COMPONENT_LABELS.BIRTHDATE);
  const submitButton = screen.getByText(COMPONENT_LABELS.CONTINUE);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.type(birthdateInput, "1970-01-01");

  fetchMock.doMockOnceIf(
    "/api/user/sign-up",
    JSON.stringify({ errors: [{ code: "invalid_email" }] }),
    { status: 400 },
  );
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_EMAIL_SIGNUP);

  fetchMock.doMockOnceIf(
    "/api/user/sign-up",
    JSON.stringify({ errors: [{ code: "invalid_password" }] }),
    { status: 400 },
  );
  await userEvent.type(passwordInput, "IsWr0ng");
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_PASSWORD_SIGNUP);

  fetchMock.doMockOnceIf(
    "/api/user/sign-up",
    JSON.stringify({ errors: [{ code: "invalid_birthdate" }] }),
    { status: 400 },
  );
  await userEvent.type(passwordInput, "IsNowRight");
  await userEvent.click(submitButton);

  screen.getByText(COMPONENT_LABELS.INVALID_BIRTHDATE_SIGNUP);
});

it("should display loading state while expecting network response", async () => {
  render(signupForm);

  const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
  const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
  const birthdateInput = screen.getByLabelText(COMPONENT_LABELS.BIRTHDATE);
  const submitButton = screen.getByText(COMPONENT_LABELS.CONTINUE);

  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Pa$$w0rd");
  await userEvent.type(birthdateInput, "1970-01-01");
  await userEvent.click(submitButton);

  screen.getByTestId("loading-overlay");
});
