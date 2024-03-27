import { render, screen } from "@testing-library/react";
import BoardDetailsView from "./BoardDetailsView";
import { MOCK_API_RESPONSES_SERIALIZED } from "@/lib/testing-utils/mockAPIResponses";
import { API_ENDPOINT_BOARD_DETAILS } from "@/lib/constants";
import { checkNextImageSrc } from "@/lib/testing-utils/misc";

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
});
