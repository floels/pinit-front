import { useAccountContext } from "@/contexts/accountContext";
import { Board, Pin } from "@/lib/types";
import PinThumbnail from "./PinThumbnail";
import { useState } from "react";
import { API_ROUTE_SAVE_PIN } from "@/lib/constants";
import { NetworkError, ResponseKOError } from "@/lib/customErrors";

type PinThumbnailContainerProps = {
  pin: Pin;
};

const PinThumbnailContainer = ({ pin }: PinThumbnailContainerProps) => {
  const { account } = useAccountContext();

  const boards = account?.boards || [];

  const [isHovered, setIsHovered] = useState(false);
  const [isSaveFlyoutOpen, setIsSaveFlyoutOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [indexBoardWhereJustSaved, setindexBoardWhereJustSaved] = useState<
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
    pin: Pin;
  }) => {
    const board = boards[boardIndex];

    setIsSaving(true);

    try {
      await fetchSavePinInBoard({ board, pin });
    } catch (error) {
      // TODO: display error toast (depending on error type)
      return;
    } finally {
      setIsSaving(false);
    }

    setindexBoardWhereJustSaved(boardIndex);

    console.warn("saved pin in board", board.title);
  };

  const fetchSavePinInBoard = async ({
    board,
    pin,
  }: {
    board: Board;
    pin: Pin;
  }) => {
    const requestBody = JSON.stringify({
      pin_id: pin.id,
      board_id: board.id,
    });

    let response;

    try {
      response = await fetch(API_ROUTE_SAVE_PIN, {
        method: "POST",
        body: requestBody,
      });
    } catch {
      throw new NetworkError();
    }

    if (!response.ok) {
      throw new ResponseKOError();
    }

    return response;
  };

  return (
    <PinThumbnail
      pin={pin}
      boards={boards}
      isHovered={isHovered}
      isSaveFlyoutOpen={isSaveFlyoutOpen}
      isSaving={isSaving}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      handleClickSave={handleClickSave}
      getClickHandlerForBoard={getClickHandlerForBoard}
    />
  );
};

export default PinThumbnailContainer;
