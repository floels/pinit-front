import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "@/messages/en.json";
import AccountOptionsFlyout from "./AccountOptionsFlyout";

const messages = en.HeaderAuthenticated;

const mockHandleClickLogOut = jest.fn();

it("should call handleClickLogOut when user clicks on 'Log out'", async () => {
  render(<AccountOptionsFlyout handleClickLogOut={mockHandleClickLogOut} />);

  const logOutElement = screen.getByText(messages.LOG_OUT);

  await userEvent.click(logOutElement);

  expect(mockHandleClickLogOut).toHaveBeenCalledTimes(1);
});
