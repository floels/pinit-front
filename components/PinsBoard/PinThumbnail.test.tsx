import { render, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import PinThumbnail from "./PinThumbnail";
import { getNextImageSrcRegexFromURL } from "@/lib/utils/testing";

it("renders image, title and author details when author details are provided", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

  render(<PinThumbnail pin={pin} />);

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

it("does not render author details when author's profile picture URL is not provided", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    description: "Pin description",
  };

  render(<PinThumbnail pin={pin} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});

it("does not render author details when author's display name is not provided", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

  render(<PinThumbnail pin={pin} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});
