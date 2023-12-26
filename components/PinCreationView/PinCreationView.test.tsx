import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toBeDisabled()`
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PinCreationView from "./PinCreationView";
import en from "@/messages/en.json";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { API_ROUTE_CREATE_PIN } from "@/lib/constants";
import { FetchMock } from "jest-fetch-mock";
import { getObjectFromFormData } from "@/lib/utils/testing";

const messages = en.PinCreation;

const mockImageFile = new File(["mockImage"], "MockImage.png", {
  type: "image/png",
});

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
  render(<PinCreationView />);

  const imageDropzone = screen.getByTestId("pin-image-dropzone");

  await act(async () => {
    fireEvent.drop(imageDropzone, { target: { files: [mockImageFile] } });
  });

  const titleInput = screen.getByTestId("pin-creation-title-input");
  await userEvent.type(titleInput, "Pin title");

  const descriptionTextArea = screen.getByTestId(
    "pin-creation-description-textarea",
  );
  await userEvent.type(descriptionTextArea, "Pin description");

  const submitButton = screen.getByTestId("pin-creation-submit-button");
  await userEvent.click(submitButton);

  await waitFor(() => {
    const mockedFetch = fetch as FetchMock; // necessary to avoid type errors

    expect(mockedFetch).toHaveBeenCalledWith(
      API_ROUTE_CREATE_PIN, // Replace with your actual API endpoint
      expect.objectContaining({
        method: "POST",
      }),
    );

    const formData = mockedFetch.mock.calls[0][1]?.body as FormData;

    const formDataObject = getObjectFromFormData(formData);

    expect(formDataObject).toMatchObject({
      title: "Pin title",
      description: "Pin description",
      imageFile: { path: "MockImage.png" },
    });
  });
});
