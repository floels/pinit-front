import { Board } from "@/lib/types";
import BoardThumbnail from "./BoardThumbnail";
import styles from "./SavedPins.module.css";

type SavedPinsProps = {
  boards: Board[];
};

const SavedPins = ({ boards }: SavedPinsProps) => {
  return (
    <ul className={styles.container}>
      {boards.map((board, index) => (
        <li key={`board-${index}`}>
          <BoardThumbnail board={board} />
        </li>
      ))}
    </ul>
  );
};

export default SavedPins;
