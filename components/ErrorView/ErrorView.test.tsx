import en from "@/messages/en.json";
import ErrorView from "./ErrorView";
import { render, screen } from "@testing-library/react";

it("should translate error message", async () => {
  render(<ErrorView errorMessageKey="Common.CONNECTION_ERROR" />);

  screen.getByText(en.Common.CONNECTION_ERROR);
});
