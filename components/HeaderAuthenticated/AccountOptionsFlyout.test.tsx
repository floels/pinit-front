import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "@/messages/en.json";
import AccountOptionsFlyout from "./AccountOptionsFlyout";

const labels = en.HomePage.Header.AccountOptionsFlyout;

const handleClickLogOut = jest.fn();

it("should call handleClickLogOut when user clicks on 'Log out'", async () => {
  render(
    <AccountOptionsFlyout
      handleClickLogOut={handleClickLogOut}
      labels={labels}
    />,
  );

  const logOutElement = screen.getByText(labels.LOG_OUT);

  await userEvent.click(logOutElement);

  expect(handleClickLogOut).toHaveBeenCalledTimes(1);
});
