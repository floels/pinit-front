import { render, screen } from "@testing-library/react";
import TextAndExploreButton from "./TextAndExploreButton";
import { FOLD } from "./LandingPageContent";

it("renders elements with the proper classes", () => {
  const props = {
    foldNumber: FOLD.SECOND,
    linkTarget: "/search/pins?q=food",
    labels: { header: "", paragraph: "", link: "" },
  };

  render(<TextAndExploreButton {...props} />);

  const container = screen.getByTestId("text-and-explore-button-container");
  expect(container.className).toEqual("container containerSecondFold");

  const button = screen.getByTestId("text-and-explore-button-button");
  expect(button.className).toEqual("button buttonSecondFold");
});
