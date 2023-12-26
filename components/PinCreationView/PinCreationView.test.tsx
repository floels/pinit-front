import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toBeDisabled()`
import { fireEvent, render, screen } from "@testing-library/react";
import PinCreationView from "./PinCreationView";
import en from "@/messages/en.json";
import { act } from "react-dom/test-utils";

const messages = en.PinCreation;

it("should render header, have input fields disabled, and not render submit button initially", async () => {
  render(<PinCreationView />);

  screen.getByText(messages.CREATE_PIN);

  const titleInput = screen.getByTestId("pin-creation-title-input");
  expect(titleInput).toBeDisabled();

  const descriptionTextArea = screen.getByTestId(
    "pin-creation-description-textarea",
  );
  expect(descriptionTextArea).toBeDisabled();

  expect(screen.queryByTestId("pin-creation-submit-button")).toBeNull();
});

it("should have input fields enabled and render submit button upon file dropped", async () => {
  const mockImageFile = new File(["mockImage"], "MockImage.png", {
    type: "image/png",
  });

  render(<PinCreationView />);

  const imageDropzone = screen.getByTestId("pin-image-dropzone");

  await act(async () => {
    fireEvent.drop(imageDropzone, { target: { files: [mockImageFile] } });
  });

  const titleInput = screen.getByTestId("pin-creation-title-input");
  expect(titleInput).toBeEnabled();

  const descriptionTextArea = screen.getByTestId(
    "pin-creation-description-textarea",
  );
  expect(descriptionTextArea).toBeEnabled();

  screen.getByTestId("pin-creation-submit-button");
});

it("should post to API route when user clicks submit", async () => {
  // render component
  // drop file
  // fill input fields
  // check payload posted to API route
});
