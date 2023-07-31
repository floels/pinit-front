"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import PictureSlider from "./PictureSlider";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import styles from "./HomePageUnauthenticatedClient.module.css";
import { HomePageUnauthenticatedServerProps } from "./HomePageUnauthenticatedServer";
import { ERROR_CODE_FETCH_FAILED } from "@/lib/constants";
import SecondFold from "./SecondFold";
import ThirdFold from "./ThirdFold";
import FourthFold from "./FourthFold";

type HomePageUnauthenticatedClientProps = HomePageUnauthenticatedServerProps & {
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const NUMBER_FOLDS = 4;
const SCROLLING_DEBOUNCING_TIME_MS = 1500;

const HomePageUnauthenticatedClient = ({
  errorCode,
  labels,
}: HomePageUnauthenticatedClientProps) => {
  const [currentFold, setCurrentFold] = useState(1);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const handleClickHeroSeeBelow = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  useEffect(() => {
    const handleMouseWheel = (event: WheelEvent) => {
      let newFold = currentFold;

      if (event.deltaY > 0) {
        // scroll down event
        if (currentFold !== NUMBER_FOLDS && !isScrollingDown) {
          // change current fold only if we are not at the last fold and we are not already scrolling down (= debouncing)
          newFold = currentFold + 1;

          setIsScrollingDown(true);
          setTimeout(() => {
            setIsScrollingDown(false);
          }, SCROLLING_DEBOUNCING_TIME_MS);
        }
      } else if (event.deltaY < 0) {
        // scroll up event: same logic
        if (currentFold > 1 && !isScrollingUp) {
          newFold = currentFold - 1;

          setIsScrollingUp(true);
          setTimeout(() => {
            setIsScrollingUp(false);
          }, SCROLLING_DEBOUNCING_TIME_MS);
        }
      }

      if (newFold !== currentFold) {
        setCurrentFold(newFold);
      }
    };

    document.addEventListener("wheel", handleMouseWheel);

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, [currentFold, isScrollingDown, isScrollingUp]);

  useEffect(() => {
    if (errorCode === ERROR_CODE_FETCH_FAILED) {
      toast.warn(labels.commons.CONNECTION_ERROR);
    }
  }, [errorCode, labels]);

  return (
    <main className={styles.container}>
      <ToastContainer position="bottom-left" autoClose={5000} />
      <div
        className={styles.content}
        style={{ transform: `translateY(-${(currentFold - 1) * 100}vh)` }}
        data-testid="homepage-unauthenticated-content"
      >
        <div className={styles.hero}>
          <HeaderUnauthenticated
            labels={{
              component: labels.component.Header,
              commons: labels.commons,
            }}
          />
          <div className={styles.pictureSlider}>
            <PictureSlider
              onClickSeeBelow={handleClickHeroSeeBelow}
              labels={labels.component.PictureSlider}
            />
          </div>
        </div>
        <SecondFold labels={labels.component.SecondFold} />
        <ThirdFold labels={labels.component.ThirdFold} />
        <FourthFold labels={labels.component.FourthFold} />
      </div>
    </main>
  );
};

export default HomePageUnauthenticatedClient;
