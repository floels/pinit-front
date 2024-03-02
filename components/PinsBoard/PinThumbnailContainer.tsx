import { useAccountContext } from "@/contexts/accountContext";
import { toast } from "react-toastify";
import { Board, PinWithAuthorDetails } from "@/lib/types";
import PinThumbnail from "./PinThumbnail";
import { useEffect, useState } from "react";
import { API_ROUTE_SAVE_PIN } from "@/lib/constants";
import { ResponseKOError } from "@/lib/customErrors";
import { useTranslations } from "next-intl";
import { throwIfKO } from "@/lib/utils/fetch";

type PinThumbnailContainerProps = {
  pin: PinWithAuthorDetails;
  isInFirstColumn: boolean;
  isInLastColumn: boolean;
};

const PinThumbnailContainer = ({
  pin,
  isInFirstColumn,
  isInLastColumn,
}: PinThumbnailContainerProps) => {
  const t = useTranslations();

  const { account } = useAccountContext();

  const boards = account?.boards || [];

  const [isHovered, setIsHovered] = useState(false);
  const [isSaveFlyoutOpen, setIsSaveFlyoutOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [indexBoardWhereJustSaved, setIndexBoardWhereJustSaved] = useState<
    number | null
  >(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClickSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // otherwise we'll navigate to pin details

    setIsSaveFlyoutOpen(true);
  };

  const handleClickOutOfSaveFlyout = () => {
    setIsSaveFlyoutOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsSaveFlyoutOpen(false);
    }
  };

  const getClickHandlerForBoard = ({ boardIndex }: { boardIndex: number }) => {
    return () => {
      savePinInBoard({ boardIndex, pin });
    };
  };

  const savePinInBoard = async ({
    boardIndex,
    pin,
  }: {
    boardIndex: number;
    pin: PinWithAuthorDetails;
  }) => {
    const board = boards[boardIndex];

    setIsSaving(true);

    try {
      await fetchSavePinInBoard({ board, pin });
    } catch (error) {
      handleSaveError(error as Error);
      return;
    } finally {
      setIsSaving(false);
    }

    handleSaveSuccess({ boardIndex });
  };

  const fetchSavePinInBoard = async ({
    board,
    pin,
  }: {
    board: Board;
    pin: PinWithAuthorDetails;
  }) => {
    const requestBody = JSON.stringify({
      pin_id: pin.id,
      board_id: board.id,
    });

    const response = await fetch(API_ROUTE_SAVE_PIN, {
      method: "POST",
      body: requestBody,
    });

    throwIfKO(response);

    return response;
  };

  const handleSaveSuccess = ({ boardIndex }: { boardIndex: number }) => {
    setIndexBoardWhereJustSaved(boardIndex);

    setIsSaveFlyoutOpen(false);
  };

  const handleSaveError = (error: Error) => {
    toast.warn(t("PinsBoard.PIN_SAVE_ERROR_MESSAGE"), {
      toastId: "toast-pin-save-error",
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <PinThumbnail
      pin={pin}
      isInFirstColumn={isInFirstColumn}
      isInLastColumn={isInLastColumn}
      boards={boards}
      isHovered={isHovered}
      isSaveFlyoutOpen={isSaveFlyoutOpen}
      isSaving={isSaving}
      indexBoardWhereJustSaved={indexBoardWhereJustSaved}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      handleClickSave={handleClickSave}
      getClickHandlerForBoard={getClickHandlerForBoard}
      handleClickOutOfSaveFlyout={handleClickOutOfSaveFlyout}
    />
  );
};

export default PinThumbnailContainer;
