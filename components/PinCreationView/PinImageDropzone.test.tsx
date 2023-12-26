import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PinImageDropzone from "./PinImageDropzone";
import en from "@/messages/en.json";
import { act } from "react-dom/test-utils";

const messages = en.PinCreation;

const mockOnFileAdded = jest.fn();

const renderComponent = () => {
  render(<PinImageDropzone onFileAdded={mockOnFileAdded} />);
};

test("it should render file upload zone initially", async () => {
  renderComponent();

  screen.getByText(messages.DROPZONE_INSTRUCTION);
});

test("it should call 'onFiledAdded' and render image preview once user dropped image file", async () => {
  const mockImageFile = new File(["mockImage"], "MockImage.png", {
    type: "image/png",
  });

  renderComponent();

  const dropzone = screen.getByTestId("pin-image-dropzone");

  await act(async () => {
    fireEvent.drop(dropzone, { target: { files: [mockImageFile] } });
  });

  expect(mockOnFileAdded).toHaveBeenCalled();

  await waitFor(() => {
    expect(screen.queryByText(messages.DROPZONE_INSTRUCTION)).toBeNull();

    screen.getByRole("img");
  });
});
