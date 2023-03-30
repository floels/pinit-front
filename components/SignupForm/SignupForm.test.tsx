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
  });
});
