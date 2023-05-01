import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import LoginForm from "./LoginForm";
import en from "@/messages/en.json";

const labels = { ...en.HomePageUnauthenticated, ...en.Common };

jest.mock("next/navigation", () => require("next-router-mock"));

const setIsLoading = jest.fn();
const onClickNoAccountYet = () => {}; // this behavior will be tested in <HomePageUnauthenticated />

const loginForm = (
  <LoginForm
    setIsLoading={setIsLoading}
    onClickNoAccountYet={onClickNoAccountYet}
    labels={labels}
  />
);

const messages = en.HomePageUnauthenticated;

describe("LoginForm", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    setIsLoading.mockClear();
  });

  it("should display relevant input errors and should send request only when inputs are valid", async () => {
    // Inspired by https://stackoverflow.com/a/55771671
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload: jest.fn() },
    });

    const user = userEvent.setup();

    fetchMock.mockResponseOnce(
      JSON.stringify({ access: "access", refresh: "refresh" })
    );

    render(loginForm);

    screen.getByText(messages.WELCOME_TO_PINIT);

    const emailInput = screen.getByLabelText(messages.EMAIL);
    const passwordInput = screen.getByLabelText(messages.PASSWORD);
    const submitButton = screen.getByText(messages.LOG_IN);

    // Fill form with invalid email and pasword and submit:
    await user.type(emailInput, "test@example");
    await user.type(passwordInput, "Pa$$");
    await user.click(submitButton);

    screen.getByText(messages.INVALID_EMAIL_INPUT);

    // Fix email but not password:
    await user.type(emailInput, ".com");
    await user.click(submitButton);

    expect(screen.queryByText(messages.INVALID_EMAIL_INPUT)).toBeNull();
    screen.getByText(messages.INVALID_PASSWORD_INPUT);

    // Fix password input:
    await user.type(passwordInput, "w0rd");
    expect(screen.queryByText(messages.INVALID_PASSWORD_INPUT)).toBeNull();

    // Submit with correct inputs:
    expect(setIsLoading).toHaveBeenCalledTimes(0);
    await user.click(submitButton);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should display relevant error when receiving a 401 response", async () => {
    const user = userEvent.setup();

    render(loginForm);

    const emailInput = screen.getByLabelText(messages.EMAIL);
    const passwordInput = screen.getByLabelText(messages.PASSWORD);
    const submitButton = screen.getByText(messages.LOG_IN);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Pa$$w0rd");

    fetchMock.mockResponseOnce(
      JSON.stringify({ errors: [{ code: "invalid_email" }] }),
      { status: 401 }
    );
    await user.click(submitButton);

    screen.getByText(messages.INVALID_EMAIL_LOGIN);

    fetchMock.mockResponseOnce(
      JSON.stringify({ errors: [{ code: "invalid_password" }] }),
      { status: 401 }
    );
    await user.type(passwordInput, "IsWr0ng");
    await user.click(submitButton);

    screen.getByText(messages.INVALID_PASSWORD_LOGIN);
  });
});
