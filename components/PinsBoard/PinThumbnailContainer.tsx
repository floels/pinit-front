import { Pin } from "@/lib/types";
import PinThumbnail from "./PinThumbnail";
import { useState } from "react";
import { useAccountContext } from "@/contexts/accountContext";

type PinThumbnailContainerProps = {
  pin: Pin;
};

const PinThumbnailContainer = ({ pin }: PinThumbnailContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { account } = useAccountContext();

  const boards = account?.boards || [];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <PinThumbnail
      pin={pin}
      isHovered={isHovered}
      boards={boards}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
    />
  );
};

export default PinThumbnailContainer;
