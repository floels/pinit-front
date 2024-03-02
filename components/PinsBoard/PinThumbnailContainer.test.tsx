import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import PinThumbnailContainer from "./PinThumbnailContainer";
import { AccountContext } from "@/contexts/accountContext";
import { getNextImageSrcRegexFromURL } from "@/lib/testing-utils/misc";
import userEvent from "@testing-library/user-event";
import {
  API_ROUTE_MY_ACCOUNT_DETAILS,
  API_ROUTE_PIN_SUGGESTIONS,
  API_ROUTE_SAVE_PIN,
} from "@/lib/constants";
import en from "@/messages/en.json";
import { ToastContainer } from "react-toastify";
import {
  MOCK_API_RESPONSES,
  MOCK_API_RESPONSES_SERIALIZED,
} from "@/lib/testing-utils/mockAPIResponses";

const pin = MOCK_API_RESPONSES_SERIALIZED[API_ROUTE_PIN_SUGGESTIONS].results[0];

const account = MOCK_API_RESPONSES_SERIALIZED[API_ROUTE_MY_ACCOUNT_DETAILS];

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
      <ToastContainer />
      <PinThumbnailContainer
        pin={pin}
        isInFirstColumn={false}
        isInLastColumn={false}
      />
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

it(`closes flyout and displays 'Saved' label with board title upon
successful save`, async () => {
  renderComponent();

  await clickSaveButton();

  const firstBoardButton = getFirstBoardButton();

  fetchMock.mockOnceIf(
    API_ROUTE_SAVE_PIN,
    MOCK_API_RESPONSES[API_ROUTE_SAVE_PIN],
  );

  await userEvent.click(firstBoardButton);

  await waitFor(() => {
    expect(screen.queryByTestId("save-pin-flyout-board-buttons")).toBeNull();

    screen.getByText("Board 1 title");

    screen.getByText(en.PinsBoard.PIN_THUMBNAIL_SAVED_LABEL_TEXT);
  });
});

it("displays appropriate error toast upon KO response on saving pin", async () => {
  renderComponent();

  await clickSaveButton();

  const firstBoardButton = getFirstBoardButton();

  fetchMock.mockOnceIf(API_ROUTE_SAVE_PIN, "{}", { status: 404 });

  await userEvent.click(firstBoardButton);

  await waitFor(() => {
    screen.getByText(en.PinsBoard.PIN_SAVE_ERROR_MESSAGE);
  });
});
