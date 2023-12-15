import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedContainer from "./HeaderAuthenticatedContainer";
import { API_ROUTE_OWNED_ACCOUNTS } from "@/lib/constants";

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
  render(<HeaderAuthenticatedContainer />);

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

it("should display owned accounts upon successful fetch", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_OWNED_ACCOUNTS,
    JSON.stringify({
      results: [
        {
          username: "johndoe",
          type: "personal",
          displayName: "John Doe",
          initial: "J",
          profilePictureURL: "https://some.url",
          backgroundPictureURL: null,
        },
        {
          username: "jdoesbusiness",
          type: "business",
          displayName: "John Doe's Business",
          initial: "J",
          profilePictureURL: "https://some.url",
          backgroundPictureURL: null,
        },
      ],
    }),
  );

  render(<HeaderAuthenticatedContainer />);

  const accountOptionsButton = screen.getByTestId("account-options-button");

  await userEvent.click(accountOptionsButton);

  screen.getByText("johndoe");
  screen.getByText("jdoesbusiness");
});
