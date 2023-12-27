import "@testing-library/jest-dom/extend-expect"; // required to use `expect(element).toBeDisabled()` and `expect(element).toBeEnabled()`
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PinCreationViewContainer from "./PinCreationViewContainer";
import en from "@/messages/en.json";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { API_ROUTE_CREATE_PIN } from "@/lib/constants";
import { FetchMock } from "jest-fetch-mock";
import { getObjectFromFormData } from "@/lib/utils/testing";
import { toast } from "react-toastify";

const messages = en.PinCreation;

jest.mock("react-toastify", () => ({
  toast: {
    warn: jest.fn(),
    success: jest.fn(),
  },
}));

const mockImageFile = new File(["mockImage"], "MockImage.png", {
  type: "image/png",
});

const dropImageFile = async () => {
  const imageDropzone = screen.getByTestId("pin-image-dropzone");

  await act(async () => {
    fireEvent.drop(imageDropzone, { target: { files: [mockImageFile] } });
  });
};

const expectInputFieldsToBeDisabled = () => {
  const titleInput = screen.getByTestId("pin-creation-title-input");
  expect(titleInput).toBeDisabled();

  const descriptionTextArea = screen.getByTestId(
    "pin-creation-description-textarea",
  );
  expect(descriptionTextArea).toBeDisabled();
};

it("should render header, have input fields disabled, and not render submit button initially", async () => {
  render(<PinCreationViewContainer />);

  screen.getByText(messages.CREATE_PIN);

  expectInputFieldsToBeDisabled();

  expect(screen.queryByTestId("pin-creation-submit-button")).toBeNull();
});

it("should render image preview, have input fields enabled and render submit button upon file dropped", async () => {
  render(<PinCreationViewContainer />);

  screen.getByText(messages.DROPZONE_INSTRUCTION);

  await dropImageFile();

  await waitFor(() => {
    expect(screen.queryByText(messages.DROPZONE_INSTRUCTION)).toBeNull();

    const pinImage = screen.getByRole("img") as HTMLImageElement;

    expect(pinImage.src).toMatch(/^data:image\/png;base64,/);

    const titleInput = screen.getByTestId("pin-creation-title-input");
    expect(titleInput).toBeEnabled();

    const descriptionTextArea = screen.getByTestId(
      "pin-creation-description-textarea",
    );
    expect(descriptionTextArea).toBeEnabled();

    screen.getByTestId("pin-creation-submit-button");
  });
});

it("should post to API route when user clicks submit", async () => {
  render(<PinCreationViewContainer />);

  await dropImageFile();

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

    expect(mockedFetch).toHaveBeenLastCalledWith(
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

it("should display loading overlay and change text of submit button when posting", async () => {
  render(<PinCreationViewContainer />);

  await dropImageFile();

  const submitButton = screen.getByTestId("pin-creation-submit-button");

  expect(submitButton).toHaveTextContent(messages.PUBLISH);

  expect(screen.queryByTestId("pin-creation-loading-overlay")).toBeNull();

  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  await userEvent.click(submitButton);

  expect(submitButton).toHaveTextContent(messages.PUBLISHING);

  screen.getByTestId("pin-creation-loading-overlay");
});

it("should display error toast and disable loading state in case of fetch error when posting", async () => {
  render(<PinCreationViewContainer />);

  await dropImageFile();

  fetchMock.mockRejectOnce(new Error("Network failure"));

  const submitButton = screen.getByTestId("pin-creation-submit-button");

  await userEvent.click(submitButton);

  expect(toast.warn).toHaveBeenLastCalledWith(
    en.Common.CONNECTION_ERROR,
    expect.anything(), // we don't really care about the options argument in this context
  );

  // Assert loading state was deactivated:
  expect(submitButton).toHaveTextContent(messages.PUBLISH);

  expect(screen.queryByTestId("pin-creation-loading-overlay")).toBeNull();
});

it("should display error toast in case of KO response upon posting", async () => {
  render(<PinCreationViewContainer />);

  await dropImageFile();

  fetchMock.doMockOnceIf(
    `${API_ROUTE_CREATE_PIN}`,
    JSON.stringify({ message: "Bad Request" }),
    { status: 400 },
  );

  const submitButton = screen.getByTestId("pin-creation-submit-button");
  await userEvent.click(submitButton);

  expect(toast.warn).toHaveBeenLastCalledWith(
    messages.ERROR_POSTING_PIN,
    expect.anything(), // we don't really care about the options argument in this context
  );
});

it("should display success toast and reset form in case of OK response upon posting", async () => {
  render(<PinCreationViewContainer />);

  await dropImageFile();

  fetchMock.doMockOnceIf(
    `${API_ROUTE_CREATE_PIN}`,
    JSON.stringify({ pinId: "0123456789012345" }),
    { status: 200 },
  );

  const submitButton = screen.getByTestId("pin-creation-submit-button");
  await userEvent.click(submitButton);

  expect(toast.success).toHaveBeenCalled();

  screen.getByText(messages.DROPZONE_INSTRUCTION);

  expectInputFieldsToBeDisabled();

  expect(screen.queryByTestId("pin-creation-submit-button")).toBeNull();
});
