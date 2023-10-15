import { render, screen, waitFor, within } from "@testing-library/react";
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

// We mock the <PictureSlider /> component because its internal timer causes the error:
// "Warning: An update to PictureSlider inside a test was not wrapped in act(...).
// When testing, code that causes React state updates should be wrapped into act(...):
// ...
// This ensures that you're testing the behavior the user would see in the browser."
jest.mock("./PictureSlider", () => {
  const MockedPictureSlider = () => <div>Mocked picture slider</div>;
  MockedPictureSlider.displayName = "MockedPictureSlider";
  return MockedPictureSlider;
});

const checkAndCloseSignUpModal = () => {
  const modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(en.LandingPage.SignupForm.FIND_NEW_IDEAS);

  const modalCloseButton = within(modal).getByTestId(
    "overlay-modal-close-button",
  );

  userEvent.click(modalCloseButton);
};

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

it("should open signup modal when clicking on 'Explore' buttons", async () => {
  render(<LandingPageClient labels={labels} />);

  const secondFold = screen.getByTestId("landing-page-second-fold");

  const exploreButtonSecondFold =
    within(secondFold).getByTestId("explore-button");

  userEvent.click(exploreButtonSecondFold);

  await waitFor(() => {
    checkAndCloseSignUpModal();
  });

  const thirdFold = screen.getByTestId("landing-page-third-fold");

  const exploreButtonThirdFold =
    within(thirdFold).getByTestId("explore-button");

  userEvent.click(exploreButtonThirdFold);

  await waitFor(() => {
    checkAndCloseSignUpModal();
  });

  const fourthFold = screen.getByTestId("landing-page-fourth-fold");

  const exploreButtonFourthFold =
    within(fourthFold).getByTestId("explore-button");

  userEvent.click(exploreButtonFourthFold);

  await waitFor(() => {
    checkAndCloseSignUpModal();
  });
});
