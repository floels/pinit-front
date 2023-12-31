import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toHaveAttribute(...)`
import { render, screen } from "@testing-library/react";
import PinDetailsView from "./PinDetailsView";
import { getNextImageSrcRegexFromURL } from "@/lib/utils/testing";

it("should render image, title, description and author details when all are provided", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

  render(<PinDetailsView pin={pin} />);

  const image = screen.getByAltText("Pin title");
  expect(image).toHaveAttribute("src", "https://pin.url");

  const title = screen.getByRole("heading", { level: 1 });
  expect(title).toHaveTextContent("Pin title");

  screen.getByText("Pin description");

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

it("should not render author details when author's profile picture URL is not provided", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    description: "Pin description",
  };

  render(<PinDetailsView pin={pin} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});

it("should not render author details when author's display name is not provided", () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

  render(<PinDetailsView pin={pin} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});
