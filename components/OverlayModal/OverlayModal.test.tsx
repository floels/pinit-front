import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OverlayModal from "./OverlayModal";

const onCloseSpy = jest.fn();

const overlayModal = (
  <OverlayModal onClose={onCloseSpy}>
    <div />
  </OverlayModal>
);

describe("OverlayModal", () => {
  it("should call onClase when user clicks on close button", async () => {
    const user = userEvent.setup();

    render(overlayModal);

    const closeButton = screen.getByTestId("overlay-modal-close-button");
    await user.click(closeButton);
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
