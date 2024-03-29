import { render, screen } from "@testing-library/react";
import BoardDetailsView from "./BoardDetailsView";
import { MOCK_API_RESPONSES_SERIALIZED } from "@/lib/testing-utils/mockAPIResponses";
import { API_ENDPOINT_BOARD_DETAILS } from "@/lib/constants";
import { checkNextImageSrc } from "@/lib/testing-utils/misc";
import en from "@/messages/en.json";

const board = MOCK_API_RESPONSES_SERIALIZED[API_ENDPOINT_BOARD_DETAILS];

const renderComponent = () => {
  render(<BoardDetailsView board={board} />);
};

it("renders board details", () => {
  renderComponent();

  screen.getByText(board.name);

  const authorProfilePicture = screen.getByTestId(
    "board-author-profile-picture",
  );

  checkNextImageSrc(authorProfilePicture, board.author.profilePictureURL);

  screen.getByText(`${board.pins.length} ${en.BoardDetails.PINS}`);

  const pinThumbnails = screen.getAllByTestId("pin-thumbnail");

  expect(pinThumbnails).toHaveLength(board.pins.length);
});
