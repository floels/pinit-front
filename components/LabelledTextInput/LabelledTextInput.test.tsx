import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LabelledTextInput from "./LabelledTextInput";

const dummyOnChange = () => {};

it("should toggle password visibility when user clicks on corresponding button", async () => {
  const user = userEvent.setup();

  const passwordLabelledTextInput = (
    <LabelledTextInput
      label="Test input"
      name="testInput"
      type="password"
      value="abc123"
      onChange={dummyOnChange}
      withPasswordShowIcon
    />
  );

  render(passwordLabelledTextInput);

  const showPasswordIcon = screen.getByTestId("show-password-icon");

  const inputElement = screen.getByLabelText("Test input") as HTMLInputElement;

  expect(inputElement.type).toBe("password");

  await user.click(showPasswordIcon);
  expect(inputElement.type).toBe("text");

  await user.click(showPasswordIcon);
  expect(inputElement.type).toBe("password");
});
