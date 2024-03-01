import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import PinThumbnailContainer from "./PinThumbnailContainer";
import { AccountContext } from "@/contexts/accountContext";
import { TypesOfAccount } from "@/lib/types";
import { getNextImageSrcRegexFromURL } from "@/lib/utils/testing";
import userEvent from "@testing-library/user-event";
import { API_ROUTE_SAVE_PIN } from "@/lib/constants";

const pin = {
  id: "999999999999999999",
  title: "Pin title",
  imageURL: "https://pin.url",
  authorUsername: "john.doe",
  authorDisplayName: "John Doe",
  authorProfilePictureURL: "https://profile.picture.url",
  description: "Pin description",
};

const account = {
  type: TypesOfAccount.PERSONAL,
  username: "johndoe",
  displayName: "John Doe",
  initial: "J",
  profilePictureURL: "https://example.com/profile-picture.jpg",
  boards: [
    {
      id: "1234",
      title: "Board 1 title",
      coverPictureURL: "https://some.domain.come/image-1.jpb",
    },
    {
      id: "5678",
      title: "Board 2 title",
      coverPictureURL: "https://some.domain.come/image-2.jpb",
    },
  ],
};

const clickSaveButton = async () => {
  fireEvent.mouseEnter(screen.getByTestId("pin-thumbnail"));

  await userEvent.click(screen.getByTestId("pin-thumbnail-save-button"));
};

const getFirstBoardButton = () => {
  const boardButtonsContainer = screen.getByTestId(
    "save-pin-flyout-board-buttons",
  );

  return boardButtonsContainer.firstChild as HTMLButtonElement;
};

const renderComponent = () => {
  const accountContext = {
    account,
    setAccount: () => {},
  };

  render(
    <AccountContext.Provider value={accountContext}>
      <PinThumbnailContainer pin={pin} />
    </AccountContext.Provider>,
  );
};

it("displays 'Save' button only upon hover", () => {
  renderComponent();

  const saveButton = screen.queryByTestId("pin-thumbnail-save-button");
  expect(saveButton).toBeNull();

  fireEvent.mouseEnter(screen.getByTestId("pin-thumbnail"));

  screen.getByTestId("pin-thumbnail-save-button");
});

it("displays boards list in flyout when user clicks 'Save' button", async () => {
  renderComponent();

  await clickSaveButton();

  const boardButtonsContainer = screen.getByTestId(
    "save-pin-flyout-board-buttons",
  );

  const boardButtons = Array.from(boardButtonsContainer.childNodes);

  expect(boardButtons).toHaveLength(2);
});

it("closes 'Save' flyout when user clicks out", async () => {
  renderComponent();

  await clickSaveButton();

  screen.getByTestId("save-pin-flyout-board-buttons");

  await userEvent.click(document.body);

  expect(screen.queryByTestId("save-pin-flyout-board-buttons")).toBeNull();
});

it("closes 'Save' flyout when user hits 'Escape'", async () => {
  renderComponent();

  await clickSaveButton();

  screen.getByTestId("save-pin-flyout-board-buttons");

  await userEvent.keyboard("[Escape]");

  expect(screen.queryByTestId("save-pin-flyout-board-buttons")).toBeNull();
});

it("displays relevant data in board buttons", async () => {
  renderComponent();

  await clickSaveButton();

  const firstBoardButton = getFirstBoardButton();

  expect(firstBoardButton).toHaveTextContent("Board 1 title");

  const firstBoardThumbnail = within(firstBoardButton).getByRole(
    "img",
  ) as HTMLImageElement;

  const srcPattern = getNextImageSrcRegexFromURL(
    account.boards[0].coverPictureURL,
  );

  expect(firstBoardThumbnail.src).toMatch(srcPattern);
});

it("displays 'Save' button in board button only when hovered", async () => {
  renderComponent();

  await clickSaveButton();

  const firstBoardButton = getFirstBoardButton();

  expect(screen.queryByTestId("board-button-save-button")).toBeNull();

  fireEvent.mouseEnter(screen.getByText("Board 1 title"));

  within(firstBoardButton).getByTestId("board-button-save-button");
});

it("displays 'Saved' label with board title upon successful save", async () => {
  renderComponent();

  await clickSaveButton();

  const firstBoardButton = getFirstBoardButton();

  fetchMock.mockOnceIf(
    API_ROUTE_SAVE_PIN,
    JSON.stringify({ board_id: account.boards[0].id, pin_id: pin.id }),
  );

  await userEvent.click(firstBoardButton);

  // TODO: check that the label is displayed
});
