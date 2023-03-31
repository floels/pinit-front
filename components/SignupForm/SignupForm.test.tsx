import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm";
import en from "../../lang/en.json";

jest.mock("next/router", () => require("next-router-mock"));

const setIsLoading = jest.fn();
const onSignupSuccess = jest.fn();
const onClickAlreadyHaveAccount = () => {}; // this behavior will be tested in <HomePageUnauthenticated />

describe("SignupForm", () => {
  it("should display relevant input errors and should send request only when inputs are valid", async () => {
    const user = userEvent.setup();

    fetchMock.mockResponseOnce(
      JSON.stringify({ access: "access", refresh: "refresh" })
    );

    render(
      <SignupForm
        setIsLoading={setIsLoading}
        onSignupSuccess={onSignupSuccess}
        onClickAlreadyHaveAccount={onClickAlreadyHaveAccount}
      />
    );

    screen.getByText(en.FIND_NEW_IDEAS);

    const emailInput = screen.getByLabelText(en.EMAIL);
    const passwordInput = screen.getByLabelText(en.PASSWORD);
    const birthdateInput = screen.getByLabelText(en.BIRTHDATE);
    const submitButton = screen.getByText(en.CONTINUE);

    // Fill form with invalid email, invalid pasword and missing birthdate and submit:
    await user.type(emailInput, "test@example");
    await user.type(passwordInput, "Pa$$");
    await user.click(submitButton);

    screen.getByText(en.INVALID_EMAIL_INPUT);

    // Fix email input but not password input or birthdate:
    await user.type(emailInput, ".com");
    await user.click(submitButton);

    expect(screen.queryByText(en.INVALID_EMAIL_INPUT)).toBeNull();
    screen.getByText(en.INVALID_PASSWORD_INPUT);

    // Fix password input but not birthdate:
    await user.type(passwordInput, "w0rd");
    expect(screen.queryByText(en.INVALID_PASSWORD)).toBeNull();
    screen.getByText(en.INVALID_BIRTHDATE_INPUT);

    // Fix birthdate ipnut:
    await user.type(birthdateInput, "1970-01-01");
    expect(screen.queryByText(en.INVALID_BIRTHDATE_INPUT)).toBeNull();

    // Submit with correct inputs:
    expect(setIsLoading).toHaveBeenCalledTimes(0);
    await user.click(submitButton);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(onSignupSuccess).toHaveBeenCalledTimes(1);
  });
});
