import { render, screen } from "@testing-library/react";
import { getNextImageSrcRegexFromURL } from "@/lib/utils/testing";
import PictureSliderPicture, { IMAGE_URLS } from "./PictureSliderPicture";

it("should render <img> element with proper 'src' attribute", () => {
  const props = {
    topicIndex: 0,
    imageIndex: 0,
    timeSinceLastStepChange: 0,
    currentStep: 1,
    previousStep: null,
  };

  render(<PictureSliderPicture {...props} />);

  const image = screen.getByRole("img") as HTMLImageElement;

  const srcPattern = getNextImageSrcRegexFromURL(
    `https://i.pinimg.com/${IMAGE_URLS.FOOD[0]}`,
  );

  expect(image.src).toMatch(srcPattern);
});
