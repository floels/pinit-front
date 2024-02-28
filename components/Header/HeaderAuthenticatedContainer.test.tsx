import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import en from "@/messages/en.json";
import HeaderAuthenticatedContainer from "./HeaderAuthenticatedContainer";
import {
  MockLocalStorage,
  getNextImageSrcRegexFromURL,
} from "@/lib/utils/testing";
import { PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY } from "@/lib/constants";

const messages = en.HeaderAuthenticated;

jest.mock("@/components/Header/AccountOptionsFlyout", () => {
  const MockedAccountOptionsFlyout = React.forwardRef(() => (
    <div data-testid="mock-account-options-flyout" />
  ));

  MockedAccountOptionsFlyout.displayName = "AccountOptionsFlyout";

  return MockedAccountOptionsFlyout;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

(localStorage as any) = new MockLocalStorage();

const renderComponent = () => {
  render(<HeaderAuthenticatedContainer />);
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

  fireEvent.mouseDown(document.body);

  expect(screen.queryByTestId("mock-account-options-flyout")).toBeNull();
});

it(`displays icon in 'Your profile' link if no profile picture URL
was found in local storage`, () => {
  renderComponent();

  screen.getByTestId("profile-link-icon");
});

it(`displays icon in 'Your profile' link if no profile picture URL
was found in local storage`, async () => {
  const profilePictureURL = "https://some.domain.com/profile-picture.jpb";

  localStorage.setItem(
    PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
    profilePictureURL,
  );

  renderComponent();

  await waitFor(() => {
    const profilePicture = screen.getByTestId(
      "profile-picture",
    ) as HTMLImageElement;

    const srcPattern = getNextImageSrcRegexFromURL(profilePictureURL);

    expect(profilePicture.src).toMatch(srcPattern);
  });
});
