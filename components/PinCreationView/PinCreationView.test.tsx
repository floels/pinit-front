import { render } from "@testing-library/react";
import PinCreationView from "./PinCreationView";

// This component is completely covered by the tests in 'PinCreationViewContainer.test.tsx'.
it("should render", () => {
  const props = {
    hasDroppedFile: false,
    imagePreviewURL: null,
    pinDetails: { title: "", description: "" },
    isPosting: false,
    handleFileDropped: () => {},
    handleInputChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {},
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => {},
  };

  render(<PinCreationView {...props} />);
});
