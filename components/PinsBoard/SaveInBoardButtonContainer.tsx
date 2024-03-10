import { useState } from "react";
import { BoardWithBasicDetails } from "@/lib/types";
import SaveInBoardButton from "./SaveInBoardButton";

type SaveInBoardButtonContainerProps = {
  board: BoardWithBasicDetails;
};

const SaveInBoardButtonContainer = ({
  board,
}: SaveInBoardButtonContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <SaveInBoardButton
      board={board}
      isHovered={isHovered}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
    />
  );
};

export default SaveInBoardButtonContainer;
