import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderUnauthenticated from "./HeaderUnauthenticated";
import en from "@/messages/en.json";

const labels = {
  component: en.HomePageUnauthenticated.Header,
  commons: en.Common,
};

describe("HeaderUnauthenticated", () => {
  it("should render without any modal open", () => {
    render(<HeaderUnauthenticated labels={labels} />);

    screen.getByText(labels.component.LOG_IN);
    screen.getByText(labels.component.SIGN_UP);

    expect(
      screen.queryByText(labels.component.LoginForm.WELCOME_TO_PINIT)
    ).toBeNull();
    expect(
      screen.queryByText(labels.component.SignupForm.FIND_NEW_IDEAS)
    ).toBeNull();
  });

  it("should open login modal when clicking on Login button, and switch to signup modal when user clicks on 'Sign up'", async () => {
    render(<HeaderUnauthenticated labels={labels} />);

    const loginButton = screen.getByText(labels.component.LOG_IN);

    await userEvent.click(loginButton);

    screen.getByText(labels.component.LoginForm.WELCOME_TO_PINIT);

    const noAccountYetDiv = screen.getByText(
      labels.component.LoginForm.NO_ACCOUNT_YET
    );
    const noAccountYetSignupButton = within(noAccountYetDiv).getByText(
      labels.component.LoginForm.SIGN_UP
    );

    await userEvent.click(noAccountYetSignupButton);

    screen.getByText(labels.component.SignupForm.FIND_NEW_IDEAS);
  });

  it("should open signup modal when clicking on Signup button, and switch to login modal when user clicks on 'Log in'", async () => {
    render(<HeaderUnauthenticated labels={labels} />);

    const signupButton = screen.getByText(labels.component.SIGN_UP);

    await userEvent.click(signupButton);

    screen.getByText(labels.component.SignupForm.FIND_NEW_IDEAS);

    const alreadyHaveAccountDiv = screen.getByText(
      labels.component.SignupForm.ALREADY_HAVE_ACCOUNT
    );
    const alreadyHaveAccountSignupButton = within(
      alreadyHaveAccountDiv
    ).getByText(labels.component.SignupForm.LOG_IN);

    await userEvent.click(alreadyHaveAccountSignupButton);

    expect(
      screen.queryByText(labels.component.SignupForm.FIND_NEW_IDEAS)
    ).toBeNull();
    screen.getByText(labels.component.LoginForm.WELCOME_TO_PINIT);
  });
});
