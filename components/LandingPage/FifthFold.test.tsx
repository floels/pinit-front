import en from "@/messages/en.json";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FifthFold from "./FifthFold";

const mockScrollIntoView = jest.fn();

const heroRef = {
  current: {
    scrollIntoView: mockScrollIntoView,
  },
} as any;

const mockOnClickBackToTop = jest.fn();

const labels = {
  component: {
    ...en.LandingPage.Content.FifthFold,
    LoginForm: en.LandingPage.Header.LoginForm,
    SignupForm: en.LandingPage.Header.SignupForm,
  },
  commons: en.Common,
};

const fifthFold = (
  <FifthFold
    heroRef={heroRef}
    onClickBackToTop={mockOnClickBackToTop}
    labels={labels}
  />
);

// Needed for the <LoginForm /> and <SignupForm /> components, which call useRouter():
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

it("should scroll hero ref into view upon rendering", async () => {
  render(fifthFold);

  expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
});

it("should switch to login form upon click on 'Already have an account'", async () => {
  render(fifthFold);

  const alreadyHaveAccountButton = screen.getByText(
    en.LandingPage.Header.SignupForm.LOG_IN,
  );

  await userEvent.click(alreadyHaveAccountButton);

  screen.getByText(en.LandingPage.Header.LoginForm.NO_ACCOUNT_YET);
});

it("should call onClickBackToTop when corresponding button is clicked", async () => {
  render(fifthFold);

  const backToTopButton = screen.getByTestId("back-to-top-button");

  await userEvent.click(backToTopButton);

  expect(mockOnClickBackToTop).toHaveBeenCalledTimes(1);
});
