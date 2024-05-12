import { render, screen } from "@testing-library/react";
import FifthFoldPicturesBackground, {
  PICTURE_URLS,
} from "./FifthFoldPicturesBackground";
import { checkNextImageSrc } from "@/lib/testing-utils/misc";

it("renders <img> elements with proper 'src' attribute", () => {
  render(<FifthFoldPicturesBackground />);

  const images = screen.queryAllByRole("img") as HTMLImageElement[];

  images.forEach((image, index) => {
    checkNextImageSrc(image, PICTURE_URLS[index]);
  });
});
