import en from "@/messages/en.json";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FifthFold from "./FifthFold";

const messages = en.LandingPageContent;

const mockScrollIntoView = jest.fn();

const heroRef = {
  current: {
    scrollIntoView: mockScrollIntoView,
  },
} as any;

const mockOnClickBackToTop = jest.fn();

const fifthFold = (
  <FifthFold heroRef={heroRef} onClickBackToTop={mockOnClickBackToTop} />
);

// Needed for the <LoginForm /> and <SignupForm /> components, which call useRouter():
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

it("should scroll hero ref into view upon rendering", () => {
  render(fifthFold);

  expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
});

it(`should switch to login form upon click on 'Already have an account',
and back to signup form upon click on 'No account yet'`, async () => {
  render(fifthFold);

  const alreadyHaveAccountButton = screen.getByText(messages.SignupForm.LOG_IN);
  await userEvent.click(alreadyHaveAccountButton);

  screen.getByText(messages.LoginForm.NO_ACCOUNT_YET);

  const noAccountYetButton = screen.getByText(messages.LoginForm.SIGN_UP);
  await userEvent.click(noAccountYetButton);

  screen.getByText(messages.SignupForm.ALREADY_HAVE_ACCOUNT);
});

it("should call onClickBackToTop when corresponding button is clicked", async () => {
  render(fifthFold);

  const backToTopButton = screen.getByTestId("back-to-top-button");

  await userEvent.click(backToTopButton);

  expect(mockOnClickBackToTop).toHaveBeenCalledTimes(1);
});
