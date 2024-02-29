import { Pin } from "@/lib/types";
import PinThumbnail from "./PinThumbnail";
import { useState } from "react";
import { useAccountContext } from "@/contexts/accountContext";

type PinThumbnailContainerProps = {
  pin: Pin;
};

const PinThumbnailContainer = ({ pin }: PinThumbnailContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaveFlyoutOpen, setIsSaveFlyoutOpen] = useState(false);

  const { account } = useAccountContext();

  const boards = account?.boards || [];

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

  return (
    <PinThumbnail
      pin={pin}
      boards={boards}
      isHovered={isHovered}
      isSaveFlyoutOpen={isSaveFlyoutOpen}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      handleClickSave={handleClickSave}
    />
  );
};

export default PinThumbnailContainer;
