import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedContainer from "./HeaderAuthenticatedContainer";
import { MockLocalStorage, checkNextImageSrc } from "@/lib/testing-utils/misc";
import {
  PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
  USERNAME_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import { AccountContext } from "@/contexts/accountContext";
import { TypesOfAccount } from "@/lib/types";
import { HeaderSearchBarContextProvider } from "@/contexts/headerSearchBarContext";

const messages = en.HeaderAuthenticated;

jest.mock("@/components/Header/AccountOptionsFlyout", () => {
  const MockedAccountOptionsFlyout = React.forwardRef(() => (
    <div data-testid="mock-account-options-flyout" />
  ));

  MockedAccountOptionsFlyout.displayName = "AccountOptionsFlyout";

  return MockedAccountOptionsFlyout;
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

(localStorage as any) = new MockLocalStorage();

const account = {
  type: TypesOfAccount.PERSONAL,
  username: "johndoe",
  displayName: "John Doe",
  initial: "J",
  profilePictureURL: "https://example.com/profile-picture.jpg",
};

const renderComponent = (accountContextProviderProps?: any) => {
  render(
    <AccountContext.Provider
      value={{ account, setAccount: jest.fn() }}
      {...accountContextProviderProps}
    >
      <HeaderSearchBarContextProvider>
        <HeaderAuthenticatedContainer />
      </HeaderSearchBarContextProvider>
    </AccountContext.Provider>,
  );
};

beforeEach(() => {
  localStorage.clear();
});

it("displays tooltip for profile link upon hover", () => {
  renderComponent();

  const profileLink = screen.getByTestId("profile-link");

  expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();

  fireEvent.mouseEnter(profileLink);
  screen.getByText(messages.YOUR_PROFILE);

  fireEvent.mouseLeave(profileLink);
  expect(screen.queryByText(messages.YOUR_PROFILE)).toBeNull();
});

it("displays tooltip for account options button upon hover", () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");

  expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();

  fireEvent.mouseEnter(accountOptionsButton);
  screen.getByText(messages.ACCOUNT_OPTIONS);

  fireEvent.mouseLeave(accountOptionsButton);
  expect(screen.queryByText(messages.ACCOUNT_OPTIONS)).toBeNull();
});

it("displays account options flyout upon click on corresponding button, and close upon hitting Escape key", async () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();

  await userEvent.click(accountOptionsButton);

  screen.getByTestId("mock-account-options-flyout");

  await userEvent.keyboard("[Escape]");

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();
});

it("closes account options button when clicking out", async () => {
  renderComponent();

  const accountOptionsButton = screen.getByTestId("account-options-button");

  await userEvent.click(accountOptionsButton);

  screen.getByTestId("mock-account-options-flyout");

  await userEvent.click(document.body);

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();
});

it(`displays profile link with proper 'href' attribute
when username is available in account context`, async () => {
  renderComponent();

  const profileLink = screen.getByTestId("profile-link");

  expect(profileLink).toHaveAttribute("href", `/${account.username}`);
});

it(`displays profile picture with proper 'src' attribute when
profile picture URL is available in account context`, () => {
  renderComponent();

  const profilePicture = screen.getByTestId("profile-picture");
  checkNextImageSrc(profilePicture, account.profilePictureURL);
});

it(`displays profile picture in 'Your profile' link if account context
is not yet available, but a username and a profile picture URL were found in
local storage`, async () => {
  const profilePictureURL = "https://some.domain.com/profile-picture.jpb";

  localStorage.setItem(USERNAME_LOCAL_STORAGE_KEY, "johndoe");
  localStorage.setItem(
    PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
    profilePictureURL,
  );

  renderComponent({ value: { account: null } });

  await waitFor(() => {
    const profilePicture = screen.getByTestId("profile-picture");

    checkNextImageSrc(profilePicture, profilePictureURL);
  });
});

it(`displays icon in 'Your profile' link if account context is not
yet available, no profile picture URL was found in local storage,
but username was found in local storage`, () => {
  localStorage.setItem(USERNAME_LOCAL_STORAGE_KEY, "johndoe");

  renderComponent({ value: { account: null } });

  screen.getByTestId("profile-link-icon");
});
