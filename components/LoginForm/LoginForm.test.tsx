import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import "@testing-library/jest-dom";
import en from "../../lang/en.json";

jest.mock("next/router", () => require("next-router-mock"));

const setIsLoading = jest.fn();
const onLoginSuccess = jest.fn();

describe("LoginForm", () => {
  it("displays relevant input errors and sends request only when inputs are valid", async () => {
    const user = userEvent.setup();

    render(
      <LoginForm setIsLoading={setIsLoading} onLoginSuccess={onLoginSuccess} />
    );

    const emailInput = screen.getByLabelText(en.EMAIL);
    const passwordInput = screen.getByLabelText(en.PASSWORD);
    const submitButton = screen.getByText(en.SIGN_IN);

    // Fill form with invalid email and pasword and submit:
    await user.type(emailInput, "test@example");
    await user.type(passwordInput, "Pa$$");
    await user.click(submitButton);

    screen.getByText(en.INVALID_EMAIL_INPUT);

    // Fix email but not password:
    await user.type(emailInput, ".com");
    await user.click(submitButton);

    expect(screen.queryByText(en.INVALID_EMAIL_INPUT)).toBeNull();
    screen.getByText(en.INVALID_PASSWORD_INPUT);

    // Fix password and submit:
    await user.type(passwordInput, "w0rd");
    expect(screen.queryByText(en.INVALID_PASSWORD)).toBeNull();
    await user.click(submitButton);
  });
});
