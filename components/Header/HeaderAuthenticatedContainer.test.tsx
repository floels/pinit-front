import userEvent from "@testing-library/user-event";
import { screen, fireEvent, render } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedContainer from "./HeaderAuthenticatedContainer";
import { API_ROUTE_OWNED_ACCOUNTS } from "@/lib/constants";
import { withQueryClient } from "@/lib/utils/testing";
import { ActiveAccountContext } from "@/contexts/ActiveAccountContext";

const messages = en.HeaderAuthenticated;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockActiveAccountContext = {
  activeAccountUsername: "testAccount",
  setActiveAccountUsername: jest.fn(),
};

const renderComponent = () => {
  render(
    <ActiveAccountContext.Provider value={mockActiveAccountContext}>
      {withQueryClient(<HeaderAuthenticatedContainer />)}
    </ActiveAccountContext.Provider>,
  );
};

it("should have the proper interactivity", async () => {
  renderComponent();

  const profileLink = screen.getByTestId("profile-link");
  const accountOptionsButton = screen.getByTestId("account-options-button");

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

it("should display spinner while fetching", async () => {
  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByTestId("owned-accounts-spinner");
});

it("should not display 'Your other accounts' section if fetch response has one single account", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_OWNED_ACCOUNTS,
    JSON.stringify({
      results: [
        {
          username: "johndoe",
          type: "personal",
          display_name: "John Doe",
          initial: "J",
          profile_picture_url: "https://profile.picture.url",
        },
      ],
    }),
  );

  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByText(messages.CURRENTLY_IN);
  screen.getByText("John Doe");
  screen.getByText("Personal");

  const profilePicture = screen.getByAltText(
    `${messages.ALT_PROFILE_PICTURE_OF} John Doe`,
  ) as HTMLImageElement;
  expect(profilePicture.src).toMatch(
    /_next\/image\?url=https%3A%2F%2Fprofile\.picture\.url/,
  ); // Since the `src` attribute is transformed by the use of <Image /> from 'next/image'

  expect(screen.queryByText(messages.YOUR_OTHER_ACCOUNTS)).toBeNull();
});

it("should display 'Your other accounts' section if fetch response has two accounts", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_OWNED_ACCOUNTS,
    JSON.stringify({
      results: [
        {
          username: "johndoe",
          type: "personal",
          display_name: "John Doe",
          initial: "J",
          profile_picture_url: "https://profile.picture.url",
        },
        {
          username: "jdoesbusiness",
          type: "business",
          display_name: "John Doe's Business",
          initial: "J",
          profile_picture_url: null,
        },
      ],
    }),
  );

  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByText(messages.YOUR_OTHER_ACCOUNTS);
  screen.getByText("John Doe's Business");
  screen.getByText("Business");
});

it("should display error response in case of KO response", async () => {
  fetchMock.doMockOnceIf(
    API_ROUTE_OWNED_ACCOUNTS,
    JSON.stringify({ errors: [{ code: "unauthorized" }] }),
    { status: 401 },
  );

  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");
  await userEvent.click(accountOptionsButton);

  screen.getByText(messages.ERROR_RETRIEVING_ACCOUNTS);
});
