import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toHaveAttribute(...)`
import { render, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import PinDetailsView from "./PinDetailsView";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => (en.PinDetails as any)[key],
}));

it("should render image, title, description and author details when all are provided", async () => {
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

  render(<PinDetailsView pin={pin} />);

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

  render(<PinDetailsView pin={pin} />);

  expect(screen.queryByTestId("pin-author-details")).toBeNull();
});
