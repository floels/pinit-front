import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import styles from "./PinsBoard.module.css";
import { PinWithAuthorDetails } from "@/lib/types";
import PinThumbnailsGrid from "../PinThumbnailsGrid/PinThumbnailsGrid";

type PinsBoardProps = {
  pins: PinWithAuthorDetails[];
  isFetching: boolean;
  fetchFailed: boolean;
  emptyResultsMessageKey?: string;
  onScrolledToBottom: () => void;
};

const PinsBoard = ({
  pins,
  isFetching,
  fetchFailed,
  emptyResultsMessageKey,
  onScrolledToBottom,
}: PinsBoardProps) => {
  const t = useTranslations();

  const scrolledToBottomSentinel = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onScrolledToBottom();
      }
    });

    if (scrolledToBottomSentinel.current) {
      observer.observe(scrolledToBottomSentinel.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const shouldRenderEmptyResultsMessage =
    !!emptyResultsMessageKey &&
    !isFetching &&
    !fetchFailed &&
    pins.length === 0;

  return (
    <div className={styles.container}>
      <PinThumbnailsGrid pins={pins} />
      <div ref={scrolledToBottomSentinel} style={{ height: "1px" }}></div>
      {shouldRenderEmptyResultsMessage && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="xs"
            className={styles.errorMessageIcon}
          />
          {t(emptyResultsMessageKey)}
        </div>
      )}
      {isFetching && (
        <div className={styles.loadingIconContainer}>
          <FontAwesomeIcon
            icon={faSpinner}
            size="2x"
            spin
            className={styles.loadingSpinner}
            data-testid="loading-spinner"
          />
        </div>
      )}
      {fetchFailed && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="xs"
            className={styles.errorMessageIcon}
          />
          {t("PinsBoard.ERROR_DISPLAY_PINS")}
        </div>
      )}
    </div>
  );
};

export default PinsBoard;
