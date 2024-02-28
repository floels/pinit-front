import { render, screen } from "@testing-library/react";
import FifthFoldPicturesBackground, {
  PICTURE_URLS,
} from "./FifthFoldPicturesBackground";
import { getNextImageSrcRegexFromURL } from "@/lib/utils/testing";

it("renders <img> elements with proper 'src' attribute", () => {
  render(<FifthFoldPicturesBackground />);

  const images = screen.queryAllByRole("img") as HTMLImageElement[];

  images.map((image, index) => {
    const srcPattern = getNextImageSrcRegexFromURL(PICTURE_URLS[index]);

    expect(image.src).toMatch(srcPattern);
  });
});
