import { render, screen } from "@testing-library/react";
import PinDetailsView from "./PinDetailsView";
import en from "@/messages/en.json";
import { checkNextImageSrc } from "@/lib/testing-utils/misc";
import { MOCK_API_RESPONSES_SERIALIZED } from "@/lib/testing-utils/mockAPIResponses";
import { API_ENDPOINT_PIN_DETAILS } from "@/lib/constants";

const messages = en.PinDetails;

const pin = MOCK_API_RESPONSES_SERIALIZED[API_ENDPOINT_PIN_DETAILS];

const renderComponent = (props?: any) => {
  return render(<PinDetailsView pin={pin} {...props} />);
};

it("renders all required elements", () => {
  renderComponent();

  const image = screen.getByAltText(pin.title);
  expect(image).toHaveAttribute("src", pin.imageURL);

  const title = screen.getByRole("heading", { level: 1 });
  expect(title).toHaveTextContent(pin.title);

  screen.getByText(pin.description);

  screen.getByTestId("pin-author-details");

  const authorProfilePicture = screen.getByAltText(
    "Profile picture of John Doe",
  );
  checkNextImageSrc(authorProfilePicture, pin.author.profilePictureURL);

  screen.getByText(pin.author.displayName);
});

it("renders fallback image 'alt' when title is empty", () => {
  const pinWithoutTitle = {
    ...pin,
    title: null,
  };

  renderComponent({ pin: pinWithoutTitle });

  screen.getByAltText(`${messages.ALT_PIN_BY} ${pin.author.displayName}`);
});
