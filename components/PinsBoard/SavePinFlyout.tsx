import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import SaveInBoardButtonContainer from "./SaveInBoardButtonContainer";
import styles from "./SavePinFlyout.module.css";
import { Board } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type SavePinFlyoutProps = {
  isInFirstColumn: boolean;
  isInLastColumn: boolean;
  boards: Board[];
  isSaving: boolean;
  getClickHandlerForBoard: ({
    boardIndex,
  }: {
    boardIndex: number;
  }) => () => void;
};

const SavePinFlyout = forwardRef<HTMLDivElement, SavePinFlyoutProps>(
  (props, ref) => {
    const {
      isInFirstColumn,
      isInLastColumn,
      boards,
      isSaving,
      getClickHandlerForBoard,
    } = props;

    const t = useTranslations("PinsBoard");

    const saveInBoardButtons = (
      <div data-testid="save-pin-flyout-board-buttons">
        {boards.map((board, index) => (
          <div
            key={`board-${index}`}
            onClick={getClickHandlerForBoard({ boardIndex: index })}
          >
            <SaveInBoardButtonContainer board={board} />
          </div>
        ))}
      </div>
    );

    const containerStyles = [styles.container];

    if (isInFirstColumn) {
      containerStyles.push(styles.containerAlignedLeft);
    } else if (isInLastColumn) {
      containerStyles.push(styles.containerAlignedRight);
    } else {
      containerStyles.push(styles.containerCentered);
    }

    return (
      <div className={containerStyles.join(" ")}>
        <span className={styles.title}>
          {t("PIN_THUMBNAIL_SAVE_FLYOUT_TITLE")}
        </span>
        <div className={styles.boardsLabelAndList}>
          <span className={styles.boardsLabel}>
            {t("PIN_THUMBNAIL_SAVE_FLYOUT_BOARDS_LABEL")}
          </span>
          {saveInBoardButtons}
        </div>
        {isSaving && (
          <div className={styles.loadingOverlay}>
            <FontAwesomeIcon
              icon={faSpinner}
              size="2x"
              spin
              className={styles.loadingSpinner}
            />
          </div>
        )}
      </div>
    );
  },
);

SavePinFlyout.displayName = "SavePinFlyout";

export default SavePinFlyout;
