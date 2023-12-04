import { useRef, useState, useEffect } from "react";
import styles from "./PinsBoardDisplay.module.css";
import PinThumbnail from "./PinThumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useViewportWidth } from "@/lib/utils/custom-hooks";
import { PinType } from "@/lib/types";
import { useTranslations } from "next-intl";

type PinsBoardDisplayProps = {
  pins: PinType[];
  isFetching: boolean;
  isFetchError: boolean;
  handleFetchMorePins: () => void;
};

const GRID_COLUMN_WIDTH_WITH_MARGINS_PX = 236 + 2 * 8; // each column has a set width of 236px and side margins of 8px
const SIDE_PADDING_PX = 16; // should be consistent with the side padding of .thumbnailsGrid in CSS file

const getNumberOfColumns = (viewportWidth: number) => {
  const theoreticalNumberOfColumns = Math.floor(
    (viewportWidth - 2 * SIDE_PADDING_PX) / GRID_COLUMN_WIDTH_WITH_MARGINS_PX,
  );

  // We force the number of columns to be between 1 and 6:
  const boundedNumberOfColumns = Math.min(
    Math.max(theoreticalNumberOfColumns, 1),
    6,
  );

  return boundedNumberOfColumns;
};

const PinsBoardDisplay = ({
  pins,
  handleFetchMorePins,
  isFetching,
  isFetchError,
}: PinsBoardDisplayProps) => {
  const t = useTranslations("PinsBoard");

  const scrolledToBottomSentinel = useRef(null);

  const [numberOfColumns, setNumberOfColumns] = useState<number | undefined>();
  const viewportWidth = useViewportWidth();

  const shouldRenderPinThumbnailsAndSentinelDiv =
    !!numberOfColumns && pins.length > 0;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleFetchMorePins();
      }
    });

    if (scrolledToBottomSentinel.current) {
      observer.observe(scrolledToBottomSentinel.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleFetchMorePins, shouldRenderPinThumbnailsAndSentinelDiv]);

  useEffect(() => {
    if (viewportWidth) {
      const calculatedColumns = getNumberOfColumns(viewportWidth);
      setNumberOfColumns(calculatedColumns);
    }
  }, [viewportWidth]);

  const castedNumberOfColumns = numberOfColumns as number;

  // Here the logic is to:
  // - render as many columns as `numberOfColumns` (casted to number to avoid TypeScript errors),
  // - then, render the thumbnails in rows, e.g. if we have 3 columns:
  //   - thumbnail #1 goes to column #1,
  //   - thumbnail #2 goes to column #2,
  //   - thumbnail #3 goes to column #3,
  //   - thumbnail #4 goes to column #1, etc.
  // We do this by conditioning the rendering of thumbnail #pinThumbnailIndex (zero-based) to:
  // `if (pinThumbnailIndex % castedNumberOfColumns === columnIndex)`
  // which translates the logic above.
  const thumbnailsGrid = (
    <div className={styles.thumbnailsGrid}>
      {Array.from({ length: castedNumberOfColumns }).map((_, columnIndex) => (
        <div
          key={`thumbnails-column-${columnIndex + 1}`}
          data-testid="thumbnails-column"
        >
          {pins.map((pin, pinIndex) => {
            if (pinIndex % castedNumberOfColumns === columnIndex) {
              return (
                <div
                  className={styles.pinThumbnail}
                  key={`pin-thumbnail-${pinIndex + 1}`}
                >
                  <PinThumbnail pin={pin} />
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );

  return (
    <main className={styles.container}>
      {shouldRenderPinThumbnailsAndSentinelDiv && thumbnailsGrid}
      {shouldRenderPinThumbnailsAndSentinelDiv && (
        <div ref={scrolledToBottomSentinel} style={{ height: "1px" }}></div>
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
      {isFetchError && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="xs"
            className={styles.errorMessageIcon}
          />
          {t("ERROR_DISPLAY_PINS")}
        </div>
      )}
    </main>
  );
};

export default PinsBoardDisplay;
