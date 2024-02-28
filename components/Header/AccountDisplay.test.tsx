import { render, screen } from "@testing-library/react";
import AccountDisplay from "./AccountDisplay";
import { TypesOfAccount } from "@/lib/types";
import userEvent from "@testing-library/user-event";

const mockOnClick = jest.fn();

const mockAccount = {
  username: "johndoe",
  type: TypesOfAccount.PERSONAL,
  displayName: "John Doe",
  initial: "J",
  profilePictureURL: "https://profile.picture.url",
};

const renderComponent = ({ isActive } = { isActive: false }) => {
  render(
    <AccountDisplay
      account={mockAccount}
      isActive={isActive}
      onClick={mockOnClick}
    />,
  );
};

it("does not render active icon if account is not active", () => {
  renderComponent();

  expect(screen.queryByTestId("icon-active-account")).toBeNull();
});

it("renders active icon if account is active", () => {
  renderComponent({ isActive: true });

  screen.getByTestId("icon-active-account");
});

it("calls 'onClick' upon click", async () => {
  renderComponent({ isActive: true });

  const container = screen.getByTestId("account-display-container");

  await userEvent.click(container);

  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
