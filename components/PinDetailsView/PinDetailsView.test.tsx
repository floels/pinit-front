import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toHaveAttribute(...)`
import { render, screen } from "@testing-library/react";
import PinDetailsView from "./PinDetailsView";

const pin = {
  id: "999999999999999999",
  title: "Pin title",
  imageURL: "https://pin.url",
  authorUsername: "",
  authorDisplayName: "",
  description: "Pin description",
};

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

it("should render image, title and description", async () => {
  render(<PinDetailsView pin={pin} />);

  const image = screen.getByAltText("Pin title");
  expect(image).toHaveAttribute("src", "https://pin.url");

  const title = screen.getByRole("heading", { level: 1 });
  expect(title).toHaveTextContent("Pin title");

  screen.getByText("Pin description");
});
