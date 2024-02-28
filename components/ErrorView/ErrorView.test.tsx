import en from "@/messages/en.json";
import ErrorView from "./ErrorView";
import { render, screen } from "@testing-library/react";

it("translates error message", () => {
  render(<ErrorView errorMessageKey="Common.CONNECTION_ERROR" />);

  screen.getByText(en.Common.CONNECTION_ERROR);
});
