import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import HeaderAuthenticated from "./HeaderAuthenticated";
import en from "@/messages/en.json";
import { HeaderSearchBarContextProvider } from "@/contexts/headerSearchBarContext";
import { createRef } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const messages = en.HeaderAuthenticated;

const mockedUsePathname = usePathname as jest.Mock;

const renderComponent = () => {
  const props = {
    username: "johndoe",
    profilePictureURL: null,
    isProfileLinkHovered: false,
    isAccountOptionsButtonHovered: false,
    isAccountOptionsFlyoutOpen: false,
    handleMouseEnterProfileLink: jest.fn(),
    handleMouseLeaveProfileLink: jest.fn(),
    handleClickAccountOptionsButton: jest.fn(),
    handleMouseEnterAccountOptionsButton: jest.fn(),
    handleMouseLeaveAccountOptionsButton: jest.fn(),
    handleClickOutOfAccountOptionsFlyout: jest.fn(),
  };

  const mockRef = createRef<HTMLButtonElement>();

  render(
    <HeaderSearchBarContextProvider>
      <HeaderAuthenticated ref={mockRef} {...props} />
    </HeaderSearchBarContextProvider>,
  );
};

it("when on home route, should mark home link as active and not mark create link as active", () => {
  mockedUsePathname.mockReturnValue("/en");

  renderComponent();

  const homeLink = screen.getByText(messages.NAV_ITEM_HOME);
  expect(homeLink).toHaveClass("navigationItemActive");

  const createLink = screen.getByText(messages.NAV_ITEM_CREATE);
  expect(createLink).not.toHaveClass("navigationItemActive");
});

it("when on pin creation route, should mark create link as active and not mark home link as active", () => {
  mockedUsePathname.mockReturnValue("/en/pin-creation-tool");

  renderComponent();

  const homeLink = screen.getByText(messages.NAV_ITEM_HOME);
  expect(homeLink).not.toHaveClass("navigationItemActive");

  const createLink = screen.getByText(messages.NAV_ITEM_CREATE);
  expect(createLink).toHaveClass("navigationItemActive");
});
