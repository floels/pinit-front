import { useAccountContext } from "@/contexts/accountContext";
import { useTranslations } from "next-intl";
import SaveInBoardButtonContainer from "./SaveInBoardButtonContainer";
import styles from "./SavePinFlyout.module.css";

type SavePinFlyoutProps = {};

const SavePinFlyout = () => {
  const t = useTranslations("PinsBoard");

  const { account } = useAccountContext();

  const boards = account?.boards || [];

  const saveInBoardButtons = (
    <div>
      {boards.map((board, index) => (
        <div key={`board-${index}`}>
          <SaveInBoardButtonContainer board={board} />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {t("PIN_THUMBNAIL_SAVE_FLYOUT_TITLE")}
      </span>
      <div className={styles.boardsLabelAndList}>
        <span className={styles.boardsLabel}>
          {t("PIN_THUMBNAIL_SAVE_FLYOUT_BOARDS_LABEL")}
        </span>
        {saveInBoardButtons}
      </div>
    </div>
  );
};

export default SavePinFlyout;
