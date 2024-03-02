import { render, screen } from "@testing-library/react";
import PinThumbnail from "./PinThumbnail";
import { getNextImageSrcRegexFromURL } from "@/lib/testing-utils/misc";
import { MOCK_API_RESPONSES_SERIALIZED } from "@/lib/testing-utils/mockAPIResponses";
import { API_ROUTE_PIN_SUGGESTIONS } from "@/lib/constants";

const pin = MOCK_API_RESPONSES_SERIALIZED[API_ROUTE_PIN_SUGGESTIONS].results[0];

const renderComponent = () => {
  render(
    <PinThumbnail
      pin={pin}
      isInFirstColumn={false}
      isInLastColumn={false}
      boards={[]}
      isHovered={false}
      indexBoardWhereJustSaved={null}
      isSaveFlyoutOpen={false}
      isSaving={false}
      handleMouseEnterImage={() => {}}
      handleMouseLeaveImage={() => {}}
      handleClickSave={() => {}}
      getClickHandlerForBoard={() => () => {}}
      handleClickOutOfSaveFlyout={() => {}}
    />,
  );
};

it("renders all required elements", () => {
  renderComponent();

  const pinImage = screen.getByAltText(pin.title);
  expect(pinImage).toHaveAttribute("src", pin.imageURL);

  screen.getByText(pin.title);

  screen.getByTestId("pin-author-details");

  const authorProfilePicture = screen.getByAltText(
    "Profile picture of John Doe",
  ) as HTMLImageElement;
  const expectedPatternAuthorProfilePictureSrc = getNextImageSrcRegexFromURL(
    pin.authorProfilePictureURL,
  );
  expect(authorProfilePicture.src).toMatch(
    expectedPatternAuthorProfilePictureSrc,
  );

  screen.getByText(pin.authorDisplayName);
});
