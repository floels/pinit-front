import { Board } from "@/lib/types";
import BoardThumbnail from "./BoardThumbnail";

type SavedPinsProps = {
  boards: Board[];
};

const SavedPins = ({ boards }: SavedPinsProps) => {
  return (
    <ul>
      {boards.map((board, index) => (
        <li key={`board-${index}`}>
          <BoardThumbnail board={board} />
        </li>
      ))}
    </ul>
  );
};

export default SavedPins;
