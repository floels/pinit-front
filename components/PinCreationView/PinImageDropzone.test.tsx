import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PinImageDropzone from "./PinImageDropzone";
import en from "@/messages/en.json";
import { act } from "react-dom/test-utils";

const messages = en.PinCreation;

const mockOnFileDropped = jest.fn();

test("it renders file upload zone if 'imagePreviewURL' props is null", () => {
  render(
    <PinImageDropzone
      imagePreviewURL={null}
      onFileDropped={mockOnFileDropped}
    />,
  );

  screen.getByText(messages.DROPZONE_INSTRUCTION);
});

test("it renders image preview if 'imagePreviewURL' props is not null", () => {
  const imagePreviewURL = "data:image/png;base64,acbdefg";

  render(
    <PinImageDropzone
      imagePreviewURL={imagePreviewURL}
      onFileDropped={mockOnFileDropped}
    />,
  );

  expect(screen.queryByText(messages.DROPZONE_INSTRUCTION)).toBeNull();

  const pinImage = screen.getByRole("img") as HTMLImageElement;

  expect(pinImage.src).toEqual(imagePreviewURL);
});

test("it calls 'onFileDropped' when user drops image file", async () => {
  const mockImageFile = new File(["mockImage"], "MockImage.png", {
    type: "image/png",
  });

  render(
    <PinImageDropzone
      imagePreviewURL={null}
      onFileDropped={mockOnFileDropped}
    />,
  );

  const dropzone = screen.getByTestId("pin-image-dropzone");

  await act(() => {
    fireEvent.drop(dropzone, { target: { files: [mockImageFile] } });
  });

  expect(mockOnFileDropped).toHaveBeenCalled();
});
