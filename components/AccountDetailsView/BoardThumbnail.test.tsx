import { BoardWithBasicDetails } from "@/lib/types/frontendTypes";
import BoardThumbnail from "./BoardThumbnail";
import { MOCK_API_RESPONSES_SERIALIZED } from "@/lib/testing-utils/mockAPIResponses";
import { API_ENDPOINT_ACCOUNT_DETAILS } from "@/lib/constants";
import { render, screen } from "@testing-library/react";
import { checkNextImageSrc } from "@/lib/testing-utils/misc";

const renderComponent = ({ board }: { board: BoardWithBasicDetails }) => {
  render(<BoardThumbnail username="johndoe" board={board} />);
};

it("renders cover picture and two secondary pictures if all are provided", () => {
  const board =
    MOCK_API_RESPONSES_SERIALIZED[API_ENDPOINT_ACCOUNT_DETAILS].boards[0];

  renderComponent({ board });

  const coverPicture = screen.getByTestId("board-thumbnail-cover-picture");
  checkNextImageSrc(coverPicture, board.firstImageURLs[0]);

  const secondaryPicture1 = screen.getByTestId(
    "board-thumbnail-secondary-picture-1",
  );
  checkNextImageSrc(secondaryPicture1, board.firstImageURLs[1]);

  const secondaryPicture2 = screen.getByTestId(
    "board-thumbnail-secondary-picture-2",
  );
  checkNextImageSrc(secondaryPicture2, board.firstImageURLs[2]);
});

it(`renders cover picture and two placeholders for secondary pictures
if only one element in 'firstImageURLs'`, () => {
  const board =
    MOCK_API_RESPONSES_SERIALIZED[API_ENDPOINT_ACCOUNT_DETAILS].boards[0];

  board.firstImageURLs = board.firstImageURLs.slice(0, 1);

  renderComponent({ board });

  const coverPicture = screen.getByTestId("board-thumbnail-cover-picture");
  checkNextImageSrc(coverPicture, board.firstImageURLs[0]);

  screen.getByTestId("board-thumbnail-secondary-picture-placeholder-1");
  screen.getByTestId("board-thumbnail-secondary-picture-placeholder-2");
});

it("renders three placeholders if 'firstImageURLs' is empty", () => {
  const board =
    MOCK_API_RESPONSES_SERIALIZED[API_ENDPOINT_ACCOUNT_DETAILS].boards[0];

  board.firstImageURLs = [];

  renderComponent({ board });

  screen.getByTestId("board-thumbnail-cover-picture-placeholder");

  screen.getByTestId("board-thumbnail-secondary-picture-placeholder-1");
  screen.getByTestId("board-thumbnail-secondary-picture-placeholder-2");
});
