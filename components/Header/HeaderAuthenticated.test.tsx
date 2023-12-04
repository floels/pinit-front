import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticated from "./HeaderAuthenticated";

const messages = en.HeaderAuthenticated;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

it("should have the proper interactivity", async () => {
  render(<HeaderAuthenticated />);

  const createButton = screen.getByText(messages.CREATE);
  const profileLink = screen.getByTestId("profile-link");
  const accountOptionsButton = screen.getByTestId("account-options-button");

  // Create button:
  expect(screen.queryByText(messages.CREATE_PIN)).toBeNull();
  await userEvent.click(createButton);
  screen.getByText(messages.CREATE_PIN);
  await userEvent.click(createButton);
  expect(screen.queryByText(messages.CREATE_PIN)).toBeNull();

  // Profile link:
  expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();
  fireEvent.mouseEnter(profileLink);
  screen.getByText(messages.YOUR_PROFILE);
  fireEvent.mouseLeave(profileLink);
  expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();

  // Account options button:
  expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();
  fireEvent.mouseEnter(accountOptionsButton);
  screen.getByText(messages.ACCOUNT_OPTIONS);
  fireEvent.mouseLeave(accountOptionsButton);
  expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();

  expect(screen.queryByText(messages.LOG_OUT)).toBeNull();
  await userEvent.click(accountOptionsButton);
  screen.getByText(messages.LOG_OUT);
  await userEvent.click(accountOptionsButton);
  expect(screen.queryByText(messages.LOG_OUT)).toBeNull();
});
