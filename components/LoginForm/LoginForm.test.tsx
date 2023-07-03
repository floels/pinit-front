/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import LoginForm from "./LoginForm";
import en from "@/messages/en.json";

const COMPONENT_LABELS = en.HomePageUnauthenticated.Header.LoginForm;
const labels = {
  component: COMPONENT_LABELS,
  commons: en.Common,
};

const setIsLoading = jest.fn();
const onClickNoAccountYet = () => {}; // this behavior will be tested in <HomePageUnauthenticated />

const loginForm = (
  <LoginForm
    setIsLoading={setIsLoading}
    onClickNoAccountYet={onClickNoAccountYet}
    labels={labels}
  />
);

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
      JSON.stringify({
        access_token: "accessToken",
        refresh_token: "refreshToken",
      })
    );

    render(loginForm);

    screen.getByText(COMPONENT_LABELS.WELCOME_TO_PINIT);

    const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
    const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
    const submitButton = screen.getByText(COMPONENT_LABELS.LOG_IN);

    // Fill form with invalid email and pasword and submit:
    await user.type(emailInput, "test@example");
    await user.type(passwordInput, "Pa$$");
    await user.click(submitButton);

    screen.getByText(COMPONENT_LABELS.INVALID_EMAIL_INPUT);

    // Fix email but not password:
    await user.type(emailInput, ".com");
    await user.click(submitButton);

    expect(screen.queryByText(COMPONENT_LABELS.INVALID_EMAIL_INPUT)).toBeNull();
    screen.getByText(COMPONENT_LABELS.INVALID_PASSWORD_INPUT);

    // Fix password input:
    await user.type(passwordInput, "w0rd");
    expect(
      screen.queryByText(COMPONENT_LABELS.INVALID_PASSWORD_INPUT)
    ).toBeNull();

    // Submit with correct inputs:
    expect(setIsLoading).not.toHaveBeenCalled();
    await user.click(submitButton);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("should display relevant error when receiving a 401 response", async () => {
    const user = userEvent.setup();

    render(loginForm);

    const emailInput = screen.getByLabelText(COMPONENT_LABELS.EMAIL);
    const passwordInput = screen.getByLabelText(COMPONENT_LABELS.PASSWORD);
    const submitButton = screen.getByText(COMPONENT_LABELS.LOG_IN);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Pa$$w0rd");

    fetchMock.mockResponseOnce(
      JSON.stringify({ errors: [{ code: "invalid_email" }] }),
      { status: 401 }
    );
    await user.click(submitButton);

    screen.getByText(COMPONENT_LABELS.INVALID_EMAIL_LOGIN);

    fetchMock.mockResponseOnce(
      JSON.stringify({ errors: [{ code: "invalid_password" }] }),
      { status: 401 }
    );
    await user.type(passwordInput, "IsWr0ng");
    await user.click(submitButton);

    screen.getByText(COMPONENT_LABELS.INVALID_PASSWORD_LOGIN);
  });
});
