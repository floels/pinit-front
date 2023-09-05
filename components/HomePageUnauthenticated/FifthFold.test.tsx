import en from "@/messages/en.json";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import userEvent from "@testing-library/user-event";
import FifthFold from "./FifthFold";

const dummyHeroRef = createRef<HTMLDivElement>();

const onClickBackToTop = jest.fn();

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
    heroRef={dummyHeroRef}
    onClickBackToTop={onClickBackToTop}
    labels={labels}
  />
);

it("should switch to login form upon click on 'Already have an account'", async () => {
  const user = userEvent.setup();

  render(fifthFold);

  const alreadyHaveAccountButton = screen.getByText(
    en.HomePageUnauthenticated.SignupForm.LOG_IN
  );

  await user.click(alreadyHaveAccountButton);

  screen.getByText(en.HomePageUnauthenticated.LoginForm.NO_ACCOUNT_YET);
});
