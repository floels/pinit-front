import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";

const labels = en.HomePage.Header;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

it("should have the proper interactivity", async () => {
  render(<HeaderAuthenticatedClient labels={labels} />);

  const createButton = screen.getByText(labels.CREATE);
  const profileLink = screen.getByTestId("profile-link");
  const accountOptionsButton = screen.getByTestId("account-options-button");

  // Create button:
  expect(screen.queryByText(labels.CREATE_PIN)).toBeNull();
  await userEvent.click(createButton);
  screen.getByText(labels.CREATE_PIN);
  await userEvent.click(createButton);
  expect(screen.queryByText(labels.CREATE_PIN)).toBeNull();

  // Profile link:
  expect(screen.queryByText(labels.YOUR_PROFILE)).toBeNull();
  fireEvent.mouseEnter(profileLink);
  screen.getByText(labels.YOUR_PROFILE);
  fireEvent.mouseLeave(profileLink);
  expect(screen.queryByText(labels.YOUR_PROFILE)).toBeNull();

  // Account options button:
  expect(screen.queryByText(labels.ACCOUNT_OPTIONS)).toBeNull();
  fireEvent.mouseEnter(accountOptionsButton);
  screen.getByText(labels.ACCOUNT_OPTIONS);
  fireEvent.mouseLeave(accountOptionsButton);
  expect(screen.queryByText(labels.ACCOUNT_OPTIONS)).toBeNull();

  expect(screen.queryByText(labels.AccountOptionsFlyout.LOG_OUT)).toBeNull();
  await userEvent.click(accountOptionsButton);
  screen.getByText(labels.AccountOptionsFlyout.LOG_OUT);
  await userEvent.click(accountOptionsButton);
  expect(screen.queryByText(labels.AccountOptionsFlyout.LOG_OUT)).toBeNull();
});
