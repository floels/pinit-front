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
    ...en.HomePageUnauthenticated.FifthFold,
    LoginForm: en.HomePageUnauthenticated.LoginForm,
    SignupForm: en.HomePageUnauthenticated.SignupForm,
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

it("should scroll hero ref into view upon rendering", async () => {
  render(fifthFold);

  expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
});

it("should switch to login form upon click on 'Already have an account'", async () => {
  const user = userEvent.setup();

  render(fifthFold);

  const alreadyHaveAccountButton = screen.getByText(
    en.HomePageUnauthenticated.SignupForm.LOG_IN,
  );

  await user.click(alreadyHaveAccountButton);

  screen.getByText(en.HomePageUnauthenticated.LoginForm.NO_ACCOUNT_YET);
});

it("should call onClickBackToTop when corresponding button is clicked", async () => {
  const user = userEvent.setup();

  render(fifthFold);

  const backToTopButton = screen.getByTestId("back-to-top-button");

  await user.click(backToTopButton);

  expect(mockOnClickBackToTop).toHaveBeenCalledTimes(1);
});
