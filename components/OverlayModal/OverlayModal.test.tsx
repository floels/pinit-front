import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OverlayModal from "./OverlayModal";

type DummyChildProps = {
  setIsLoading: (arg0: boolean) => void;
};

const DummyChild = ({ setIsLoading }: DummyChildProps) => (
  <div>
    <button onClick={() => setIsLoading(true)}>Start loading</button>
    <button onClick={() => setIsLoading(false)}>Stop loading</button>
  </div>
);

const onCloseSpy = jest.fn();

const overlayModalWithDummyChild = (
  <OverlayModal onClose={onCloseSpy}>
    <DummyChild
      {...({} as DummyChildProps)} /* setIsLoading is injected by <OverlayModal />*/
    />
  </OverlayModal>
);

describe("OverlayModal", () => {
  it("should close when asked to close, except if loading", async () => {
    const user = userEvent.setup();

    render(overlayModalWithDummyChild);

    const closeButton = screen.getByTestId("overlay-modal-close-button");

    // Should display loading overlay and not close when loading:
    expect(screen.queryByTestId("overlay-modal-loading-overlay")).toBeNull();
    await user.click(screen.getByText("Start loading"));
    screen.getByTestId("overlay-modal-loading-overlay");
    await user.click(closeButton);
    expect(onCloseSpy).not.toHaveBeenCalled();

    // When not loading...
    await user.click(screen.getByText("Stop loading"));
    expect(screen.queryByTestId("overlay-modal-loading-overlay")).toBeNull();

    // ... should close on click on close button:
    await user.click(closeButton);
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
