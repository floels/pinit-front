import { render, screen } from "@testing-library/react";
import SuccessToastMessage from "./SuccessToastMessage";

it("renders link with proper 'href' attribute", () => {
  render(<SuccessToastMessage pinId="123456789" />);

  const link = screen.getByRole("link") as HTMLAnchorElement;

  expect(link.href).toMatch(/\/pin\/123456789$/);
});
