import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import PinCreationViewContainer from "./PinCreationViewContainer";
import en from "@/messages/en.json";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { API_ROUTE_CREATE_PIN } from "@/lib/constants";
import { FetchMock } from "jest-fetch-mock";
import { getObjectFromFormData } from "@/lib/testing-utils/misc";
import { ToastContainer } from "react-toastify";
import { MOCK_API_RESPONSES } from "@/lib/testing-utils/mockAPIResponses";

const messages = en.PinCreation;

const mockImageFile = new File(["mockImage"], "MockImage.png", {
  type: "image/png",
});

const dropImageFile = async () => {
  const imageDropzone = screen.getByTestId("pin-image-dropzone");

  await act(async () => {
    await fireEvent.drop(imageDropzone, { target: { files: [mockImageFile] } });
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

const renderComponent = () => {
  render(
    <div>
      <ToastContainer />
      <PinCreationViewContainer />
    </div>,
  );
};

it("renders header, have input fields disabled, and not render submit button initially", () => {
  renderComponent();

  screen.getByText(messages.CREATE_PIN);

  expectInputFieldsToBeDisabled();

  expect(screen.queryByTestId("pin-creation-submit-button")).toBeNull();
});

it.only("renders image preview, have input fields enabled and render submit button upon file dropped", async () => {
  renderComponent();

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

it("renders dropzone again and hide submit button upon click on 'delete image'", async () => {
  renderComponent();

  await dropImageFile();

  await waitFor(async () => {
    const deleteButton = screen.getByTestId(
      "pin-image-dropzone-delete-image-button",
    ) as HTMLDivElement;

    await userEvent.click(deleteButton);

    screen.getByText(messages.DROPZONE_INSTRUCTION);

    expect(screen.queryByTestId("pin-creation-submit-button")).toBeNull();
  });
});

it("posts to API route when user clicks submit", async () => {
  renderComponent();

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
      API_ROUTE_CREATE_PIN,
      expect.objectContaining({
        method: "POST",
      }),
    );

    const formData = mockedFetch.mock.calls[0][1]?.body as FormData;

    const formDataObject = getObjectFromFormData(formData);

    expect(formDataObject).toMatchObject({
      title: "Pin title",
      description: "Pin description",
      image_file: { path: "MockImage.png" },
    });
  });
});

it(`displays success toast with proper link and resets form 
upon successful creation`, async () => {
  renderComponent();

  await dropImageFile();

  fetchMock.mockOnceIf(
    `${API_ROUTE_CREATE_PIN}`,
    MOCK_API_RESPONSES[API_ROUTE_CREATE_PIN],
    { status: 201 },
  );

  const submitButton = screen.getByTestId("pin-creation-submit-button");
  await userEvent.click(submitButton);

  const successMessage = screen.getByTestId("success-toast-message");
  const pinLink = within(successMessage).getByRole("link") as HTMLAnchorElement;
  expect(pinLink.href).toMatch(/\/pin\/000000000000000001$/);

  // Check form was reset:
  screen.getByText(messages.DROPZONE_INSTRUCTION);
  expectInputFieldsToBeDisabled();
  expect(screen.queryByTestId("pin-creation-submit-button")).toBeNull();
});

it("displays loading overlay and change text of submit button when posting", async () => {
  renderComponent();

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

it("displays error toast in case of KO response upon posting", async () => {
  renderComponent();

  await dropImageFile();

  fetchMock.mockOnceIf(`${API_ROUTE_CREATE_PIN}`, "{}", {
    status: 400,
  });

  const submitButton = screen.getByTestId("pin-creation-submit-button");
  await userEvent.click(submitButton);

  screen.getByText(messages.ERROR_POSTING_PIN);

  // Assert loading state was deactivated:
  expect(submitButton).toHaveTextContent(messages.PUBLISH);
  expect(screen.queryByTestId("pin-creation-loading-overlay")).toBeNull();
});
