import { render, screen } from "@testing-library/react";
import AccountDetailsView from "./AccountDetailsView";
import en from "@/messages/en.json";
import { checkNextImageSrc } from "@/lib/testing-utils/misc";
import { MOCK_API_RESPONSES_SERIALIZED } from "@/lib/testing-utils/mockAPIResponses";
import { API_ENDPOINT_ACCOUNT_DETAILS } from "@/lib/constants";

const account = MOCK_API_RESPONSES_SERIALIZED[API_ENDPOINT_ACCOUNT_DETAILS];

it("renders all relevant details", () => {
  render(<AccountDetailsView account={account} />);

  screen.getByText(account.displayName);
  screen.getByText(account.username);
  screen.getByText(account.description);

  const profilePicture = screen.getByAltText(
    `${en.AccountDetails.ALT_PROFILE_PICTURE_OF} John Doe`,
  );
  checkNextImageSrc(profilePicture, account.profilePictureURL);

  const backgroundPicture = screen.getByAltText(
    `${en.AccountDetails.ALT_BACKGROUND_PICTURE_OF} John Doe`,
  );
  checkNextImageSrc(backgroundPicture, account.backgroundPictureURL);
});

it("displays initial when profile picture is not provided", () => {
  const accountWithoutProfilePictureURL = {
    ...account,
    profilePictureURL: null,
  };

  render(<AccountDetailsView account={accountWithoutProfilePictureURL} />);

  screen.getByText("J");
});
