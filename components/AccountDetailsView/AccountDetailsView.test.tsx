import { render, screen } from "@testing-library/react";
import AccountDetailsView from "./AccountDetailsView";
import en from "@/messages/en.json";

const accountDetailsWithoutBackgroundPictureURL = {
  displayName: "Brian Brown",
  username: "brian_brown",
  description: "Description for Brian Brown.",
  profilePictureURL: "https://profile.picture.url",
};

it("should render relevant details when provided", async () => {
  render(
    <AccountDetailsView
      {...accountDetailsWithoutBackgroundPictureURL}
      backgroundPictureURL="https://background.picture.url"
    />,
  );

  screen.getByText(accountDetailsWithoutBackgroundPictureURL.displayName);
  screen.getByText(accountDetailsWithoutBackgroundPictureURL.username);
  screen.getByText(accountDetailsWithoutBackgroundPictureURL.description);

  const profilePicture = screen.getByAltText(
    `${en.AccountDetails.ALT_PROFILE_PICTURE_OF} Brian Brown`,
  ) as HTMLImageElement;
  expect(profilePicture.src).toMatch(
    /_next\/image\?url=https%3A%2F%2Fprofile\.picture\.url/,
  ); // Since the `src` attribute is transformed by the use of <Image /> from 'next/image'

  const backgroundPicture = screen.getByAltText(
    `${en.AccountDetails.ALT_BACKGROUND_PICTURE_OF} Brian Brown`,
  ) as HTMLImageElement;
  expect(backgroundPicture.src).toMatch(
    /_next\/image\?url=https%3A%2F%2Fbackground\.picture\.url/,
  ); // Since the `src` attribute is transformed by the use of <Image /> from 'next/image'
});

it("should not display background picture when URL is not provided", async () => {
  render(
    <AccountDetailsView
      {...accountDetailsWithoutBackgroundPictureURL}
      backgroundPictureURL={null}
    />,
  );

  expect(
    screen.queryByAltText(
      `${en.AccountDetails.ALT_BACKGROUND_PICTURE_OF} Brian Brown`,
    ),
  ).toBeNull();
});
