import { Board } from "@/lib/types";
import styles from "./SaveInBoardButton.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessBoard } from "@fortawesome/free-solid-svg-icons";
import { ellipsizeText } from "@/lib/utils/strings";
import { useTranslations } from "next-intl";

type SaveInBoardButtonProps = {
  board: Board;
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
};

const SaveInBoardButton = ({
  board,
  isHovered,
  handleMouseEnter,
  handleMouseLeave,
}: SaveInBoardButtonProps) => {
  const t = useTranslations("PinsBoard");

  const { title, coverPictureURL } = board;

  const hasCoverPictureURL = !!coverPictureURL;

  let boardThumbnail;

  if (hasCoverPictureURL) {
    boardThumbnail = (
      <Image
        src={coverPictureURL}
        alt={title}
        width={40}
        height={40}
        className={styles.thumbnailImage}
      />
    );
  } else {
    boardThumbnail = (
      <div className={styles.thumbnailIconContainer}>
        <FontAwesomeIcon icon={faChessBoard} size="2x" />
      </div>
    );
  }

  const textLongEllipsis = ellipsizeText({ text: title, maxLength: 40 });
  const textShortEllipsis = ellipsizeText({ text: title, maxLength: 20 });

  const saveButton = (
    <span className={styles.saveButton} data-testid="board-button-save-button">
      {t("SAVE_IN_BOARD_BUTTON_TEXT")}
    </span>
  );

  return (
    <button
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.boardThumbnailAndTitle}>
        {boardThumbnail}
        <span className={styles.boardTitle}>
          {isHovered ? textShortEllipsis : textLongEllipsis}
        </span>
      </div>
      {isHovered && saveButton}
    </button>
  );
};

export default SaveInBoardButton;
