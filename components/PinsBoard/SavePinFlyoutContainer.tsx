import { Board } from "@/lib/types";
import SavePinFlyout from "./SavePinFlyout";
import { useEffect, useRef } from "react";

type SavePinFlyoutContainerProps = {
  boards: Board[];
  isSaving: boolean;
  getClickHandlerForBoard: ({
    boardIndex,
  }: {
    boardIndex: number;
  }) => () => void;
  handleClickOutOfSaveFlyout: () => void;
};

const SavePinFlyoutContainer = ({
  boards,
  isSaving,
  getClickHandlerForBoard,
  handleClickOutOfSaveFlyout,
}: SavePinFlyoutContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickDocument = (event: MouseEvent) => {
    const target = event.target as Node;

    const userClickedOut = !ref.current?.contains(target);

    if (userClickedOut) {
      handleClickOutOfSaveFlyout();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickDocument);

    return () => {
      document.removeEventListener("click", handleClickDocument);
    };
  }, []);

  return (
    <SavePinFlyout
      boards={boards}
      isSaving={isSaving}
      getClickHandlerForBoard={getClickHandlerForBoard}
      ref={ref}
    />
  );
};

export default SavePinFlyoutContainer;
