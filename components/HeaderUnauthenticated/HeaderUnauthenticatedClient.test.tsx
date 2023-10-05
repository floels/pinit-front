import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderUnauthenticatedClient from "./HeaderUnauthenticatedClient";
import en from "@/messages/en.json";

const labels = {
  component: {
    ...en.LandingPage.Header,
    LoginForm: en.LandingPage.Header.LoginForm,
    SignupForm: en.LandingPage.Header.SignupForm,
  },
  commons: en.Common,
};

// Needed for the <LoginForm /> and <SignupForm /> components, which call useRouter().refresh():
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

it("should render without any modal open", () => {
  render(<HeaderUnauthenticatedClient labels={labels} />);

  screen.getByText(en.LandingPage.Header.LOG_IN);
  screen.getByText(en.LandingPage.Header.SIGN_UP);

  expect(
    screen.queryByText(en.LandingPage.Header.LoginForm.WELCOME_TO_PINIT),
  ).toBeNull();
  expect(
    screen.queryByText(en.LandingPage.Header.SignupForm.FIND_NEW_IDEAS),
  ).toBeNull();
});

it("should open login modal when clicking on Login button, and switch to signup modal when user clicks on 'Sign up'", async () => {
  render(<HeaderUnauthenticatedClient labels={labels} />);

  const loginButton = screen.getByText(en.LandingPage.Header.LOG_IN);

  await userEvent.click(loginButton);

  screen.getByText(en.LandingPage.Header.LoginForm.WELCOME_TO_PINIT);

  const noAccountYetDiv = screen.getByText(
    en.LandingPage.Header.LoginForm.NO_ACCOUNT_YET,
  );
  const noAccountYetSignupButton = within(noAccountYetDiv).getByText(
    en.LandingPage.Header.LoginForm.SIGN_UP,
  );

  await userEvent.click(noAccountYetSignupButton);

  screen.getByText(en.LandingPage.Header.SignupForm.FIND_NEW_IDEAS);
});

it("should open signup modal when clicking on Signup button, and switch to login modal when user clicks on 'Log in'", async () => {
  render(<HeaderUnauthenticatedClient labels={labels} />);

  const signupButton = screen.getByText(en.LandingPage.Header.SIGN_UP);

  await userEvent.click(signupButton);

  screen.getByText(en.LandingPage.Header.SignupForm.FIND_NEW_IDEAS);

  const alreadyHaveAccountDiv = screen.getByText(
    en.LandingPage.Header.SignupForm.ALREADY_HAVE_ACCOUNT,
  );
  const alreadyHaveAccountSignupButton = within(
    alreadyHaveAccountDiv,
  ).getByText(en.LandingPage.Header.SignupForm.LOG_IN);

  await userEvent.click(alreadyHaveAccountSignupButton);

  expect(
    screen.queryByText(en.LandingPage.Header.SignupForm.FIND_NEW_IDEAS),
  ).toBeNull();
  screen.getByText(en.LandingPage.Header.LoginForm.WELCOME_TO_PINIT);
});
