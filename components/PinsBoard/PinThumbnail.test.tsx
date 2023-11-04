import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toHaveAttribute(...)`
import en from "@/messages/en.json";
import PinThumbnail from "./PinThumbnail";

const labels = en.HomePage.Content.PinsBoard;

it("should render image, title and author details when author details are provided", async () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

  render(<PinThumbnail pin={pin} labels={labels} />);

  const pinImage = screen.getByAltText("Pin title");
  expect(pinImage).toHaveAttribute("src", "https://pin.url");

  screen.getByText(pin.title);

  screen.getByTestId("pin-author-details");

  const authorProfilePicture = screen.getByAltText(
    "Profile picture of John Doe",
  ) as HTMLImageElement;
  expect(
    authorProfilePicture.src.startsWith(
      "/_next/image?url=https%3A%2F%2Fprofile.picture.url",
    ),
  ); // Since the `src` attribute is transformed by the use of <Image /> from 'next/image'

  screen.getByText(pin.authorDisplayName);
});

it("should not render author details when author's profile picture URL is not provided", async () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorDisplayName: "John Doe",
    description: "Pin description",
  };

  render(<PinThumbnail pin={pin} labels={labels} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});

it("should not render author details when author's display name is not provided", async () => {
  const pin = {
    id: "999999999999999999",
    title: "Pin title",
    imageURL: "https://pin.url",
    authorUsername: "john.doe",
    authorProfilePictureURL: "https://profile.picture.url",
    description: "Pin description",
  };

  render(<PinThumbnail pin={pin} labels={labels} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});
