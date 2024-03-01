import { render, screen } from "@testing-library/react";
import PinThumbnail from "./PinThumbnail";
import { getNextImageSrcRegexFromURL } from "@/lib/utils/testing";

it("renders all required elements", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

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
      handleMouseEnter={() => {}}
      handleMouseLeave={() => {}}
      handleClickSave={() => {}}
      getClickHandlerForBoard={() => () => {}}
      handleClickOutOfSaveFlyout={() => {}}
    />,
  );

  const pinImage = screen.getByAltText("Pin title");
  expect(pinImage).toHaveAttribute("src", "https://pin.url");

  screen.getByText(pin.title);

  screen.getByTestId("pin-author-details");

  const authorProfilePicture = screen.getByAltText(
    "Profile picture of John Doe",
  ) as HTMLImageElement;
  const expectedPatternAuthorProfilePictureSrc = getNextImageSrcRegexFromURL(
    "https://profile.picture.url",
  );
  expect(authorProfilePicture.src).toMatch(
    expectedPatternAuthorProfilePictureSrc,
  );

  screen.getByText(pin.authorDisplayName);
});
