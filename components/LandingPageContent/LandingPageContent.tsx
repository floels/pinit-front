"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import PictureSlider from "./PictureSlider";
import styles from "./LandingPageContent.module.css";
import SecondFold from "./SecondFold";
import ThirdFold from "./ThirdFold";
import FourthFold from "./FourthFold";
import FifthFold from "./FifthFold";

const NUMBER_FOLDS = 5;
export const SCROLLING_DEBOUNCING_TIME_MS = 80;

const computeContentClass = ({ currentFold }: { currentFold: number }) => {
  if (currentFold === 1) {
    return styles.content;
  }

  if (currentFold === 2) {
    return `${styles.content} ${styles.contentSecondFoldActive}`;
  }

  if (currentFold === 3) {
    return `${styles.content} ${styles.contentThirdFoldActive}`;
  }

  if (currentFold === 4) {
    return `${styles.content} ${styles.contentFourthFoldActive}`;
  }

  return `${styles.content} ${styles.contentFifthFoldActive}`;
};

const LandingPageContent = () => {
  const t = useTranslations("Common");

  // This will be needed to scroll back to the top of the page in the `useEffect` hook of the <FithFold /> child component,
  // Otherwise, for some reason, browsers scroll down to the <FifthFold /> component and focus on the first input of the
  // <SignupForm /> it renders on page load.
  const heroRef = useRef(null);

  const [currentFold, setCurrentFold] = useState(1);

  const [dateLastScroll, setDateLastScroll] = useState<{
    down: Date | null;
    up: Date | null;
  }>({
    down: null,
    up: null,
  });

  const handleClickHeroSeeBelow = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  const handleClickBackToTop = () => {
    setCurrentFold(1);
  };

  const handleMouseWheel = useCallback(
    (event: WheelEvent) => {
      if (!event.deltaY) {
        return;
      }

      const scrollDirection = event.deltaY > 0 ? "down" : "up";

      const dateLastScrollSameDirection = dateLastScroll[scrollDirection];

      const now = new Date();

      setDateLastScroll({ ...dateLastScroll, [scrollDirection]: now });

      let timeElapsedSinceLastScrollSameDirection;

      if (dateLastScrollSameDirection) {
        timeElapsedSinceLastScrollSameDirection =
          now.getTime() - dateLastScrollSameDirection.getTime();
      }

      const shouldBeDebounced =
        timeElapsedSinceLastScrollSameDirection &&
        timeElapsedSinceLastScrollSameDirection < SCROLLING_DEBOUNCING_TIME_MS;

      if (shouldBeDebounced) {
        return;
      }

      if (scrollDirection === "down" && currentFold !== NUMBER_FOLDS) {
        setCurrentFold(currentFold + 1);
      } else if (scrollDirection === "up" && currentFold > 1) {
        setCurrentFold(currentFold - 1);
      }
    },
    [currentFold, dateLastScroll, setDateLastScroll, setCurrentFold],
  );

  useEffect(() => {
    document.addEventListener("wheel", handleMouseWheel);

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, [handleMouseWheel]);

  const contentClass = computeContentClass({ currentFold });

  return (
    <main className={styles.container}>
      <div className={contentClass} data-testid="landing-page-content">
        <div className={styles.hero} ref={heroRef}>
          <PictureSlider onClickSeeBelow={handleClickHeroSeeBelow} />
        </div>
        <SecondFold />
        <ThirdFold />
        <FourthFold />
        <FifthFold heroRef={heroRef} onClickBackToTop={handleClickBackToTop} />
      </div>
    </main>
  );
};

export default LandingPageContent;
