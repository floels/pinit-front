"use client";

import { useViewportWidth } from "@/lib/utils/custom-hooks";
import styles from "./HomePageAuthenticatedClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";

type HomePageAuthenticatedClientProps = {
  initialPinSuggestions: PinSuggestionType[];
  labels: { [key: string]: any };
};

const GRID_COLUMN_WIDTH_WITH_MARGINS_PX = 236 + 2 * 8;

const getNumberOfColumns = (viewportWidth: number = 0) => {
  const theoreticalNumberOfColumns = Math.floor(viewportWidth / GRID_COLUMN_WIDTH_WITH_MARGINS_PX);

  const boundedNumberOfColumns = Math.min(Math.max(theoreticalNumberOfColumns, 2), 6);

  return boundedNumberOfColumns;
};

const HomePageAuthenticatedClient = ({ initialPinSuggestions, labels }: HomePageAuthenticatedClientProps) => {
  const viewportWidth = useViewportWidth();

  const numberOfColumns = getNumberOfColumns(viewportWidth);

  const gridWidthPx = numberOfColumns * GRID_COLUMN_WIDTH_WITH_MARGINS_PX;

  return (
    <main className={styles.container}>
      <div className={styles.grid} style={{ columnCount: numberOfColumns, width: `${gridWidthPx}px` }}>
        {initialPinSuggestions.map((pinSuggestion) => (
          <div className={styles.pinSuggestion} key={pinSuggestion.id}>
            <PinSuggestion pinSuggestion={pinSuggestion} labels={labels} />
          </div>
        ))}
      </div>
    </main>
  );
};

export default HomePageAuthenticatedClient;
