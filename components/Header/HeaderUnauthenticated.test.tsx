import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "@/messages/en.json";
import HeaderUnauthenticated from "./HeaderUnauthenticated";
import { usePathname } from "next/navigation";
import { HeaderSearchBarContextProvider } from "@/contexts/headerSearchBarContext";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const messages = en.LandingPageContent;

const renderComponent = () => {
  render(
    <HeaderSearchBarContextProvider>
      <HeaderUnauthenticated />
    </HeaderSearchBarContextProvider>,
  );
};

it("renders without any modal open", () => {
  renderComponent();

  expect(screen.queryByTestId("overlay-modal")).toBeNull();
});

it("renders with search bar when pathname is not '/'", () => {
  renderComponent();

  screen.getByTestId("header-search-bar");
});

it("renders without search bar when pathname is '/'", () => {
  (usePathname as jest.Mock).mockReturnValue("/");

  renderComponent();

  expect(screen.queryByTestId("header-search-bar")).toBeNull();
});

it("opens login modal when user clicks on Login button, and switch to signup modal when user clicks on 'Sign up'", async () => {
  renderComponent();

  const logInButton = screen.getByTestId("header-log-in-button");

  await userEvent.click(logInButton);

  let modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(messages.LoginForm.WELCOME_TO_PINIT);

  const noAccountYetDiv = within(modal).getByText(
    messages.LoginForm.NO_ACCOUNT_YET,
  );

  const noAccountYetSignupButton = within(noAccountYetDiv).getByText(
    messages.LoginForm.SIGN_UP,
  );

  await userEvent.click(noAccountYetSignupButton);

  modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(messages.SignupForm.FIND_NEW_IDEAS);
});

it("opens signup modal when user clicks on Signup button, and switch to login modal when user clicks on 'Log in'", async () => {
  renderComponent();

  const signUpButton = screen.getByTestId("header-sign-up-button");

  await userEvent.click(signUpButton);

  let modal = screen.getByTestId("overlay-modal");

  within(modal).getByText(messages.SignupForm.FIND_NEW_IDEAS);

  const alreadyHaveAccountDiv = within(modal).getByText(
    messages.SignupForm.ALREADY_HAVE_ACCOUNT,
  );

  const alreadyHaveAccountSignupButton = within(
    alreadyHaveAccountDiv,
  ).getByText(messages.SignupForm.LOG_IN);

  await userEvent.click(alreadyHaveAccountSignupButton);

  modal = screen.getByTestId("overlay-modal");

  expect(
    within(modal).queryByText(messages.SignupForm.FIND_NEW_IDEAS),
  ).toBeNull();

  within(modal).getByText(messages.LoginForm.WELCOME_TO_PINIT);
});

it("closes login modal when user clicks close button", async () => {
  renderComponent();

  const logInButton = screen.getByTestId("header-log-in-button");

  await userEvent.click(logInButton);

  screen.getByTestId("overlay-modal");

  const closeButton = screen.getByTestId("overlay-modal-close-button");

  await userEvent.click(closeButton);

  expect(screen.queryByTestId("overlay-modal")).toBeNull();
});

it("closes signup modal when user clicks close button", async () => {
  renderComponent();

  const signUpButton = screen.getByTestId("header-sign-up-button");

  await userEvent.click(signUpButton);

  screen.getByTestId("overlay-modal");

  const closeButton = screen.getByTestId("overlay-modal-close-button");

  await userEvent.click(closeButton);

  expect(screen.queryByTestId("overlay-modal")).toBeNull();
});
