import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPageClient from "./LandingPageClient";
import en from "@/messages/en.json";

const labels = {
  component: en.LandingPage,
  commons: en.Common,
};

// Needed for the <LoginForm /> and <SignupForm /> components, which call useRouter().refresh():
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

it("should render without any modal open", () => {
  render(<LandingPageClient labels={labels} />);

  expect(screen.queryByTestId("overlay-modal")).toBeNull();
});

it("should open login modal when user clicks on Login button, and switch to signup modal when user clicks on 'Sign up'", async () => {
  render(<LandingPageClient labels={labels} />);

  const loginButton = screen.getByTestId("header-log-in-button");

  await userEvent.click(loginButton);

  let modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(en.LandingPage.LoginForm.WELCOME_TO_PINIT);

  const noAccountYetDiv = within(modal).getByText(
    en.LandingPage.LoginForm.NO_ACCOUNT_YET,
  );

  const noAccountYetSignupButton = within(noAccountYetDiv).getByText(
    en.LandingPage.LoginForm.SIGN_UP,
  );

  await userEvent.click(noAccountYetSignupButton);

  modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(en.LandingPage.SignupForm.FIND_NEW_IDEAS);
});

it("should open signup modal when user clicks on Signup button, and switch to login modal when user clicks on 'Log in'", async () => {
  render(<LandingPageClient labels={labels} />);

  const signupButton = screen.getByTestId("header-sign-up-button");

  await userEvent.click(signupButton);

  let modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(en.LandingPage.SignupForm.FIND_NEW_IDEAS);

  const alreadyHaveAccountDiv = within(modal).getByText(
    en.LandingPage.SignupForm.ALREADY_HAVE_ACCOUNT,
  );

  const alreadyHaveAccountSignupButton = within(
    alreadyHaveAccountDiv,
  ).getByText(en.LandingPage.SignupForm.LOG_IN);

  await userEvent.click(alreadyHaveAccountSignupButton);

  modal = screen.getByTestId("overlay-modal");

  expect(
    within(modal).queryByText(en.LandingPage.SignupForm.FIND_NEW_IDEAS),
  ).toBeNull();

  within(modal).getByText(en.LandingPage.LoginForm.WELCOME_TO_PINIT);
});
