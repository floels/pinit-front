"use client";

import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import PictureSlider from "./PictureSlider";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import styles from "./HomePageUnauthenticatedClient.module.css";
import { HomePageUnauthenticatedServerProps } from "./HomePageUnauthenticatedServer";
import { ERROR_CODE_FETCH_FAILED } from "@/lib/constants";
import SecondFold from "./SecondFold";
import ThirdFold from "./ThirdFold";
import FourthFold from "./FourthFold";
import FifthFold from "./FifthFold";

type HomePageUnauthenticatedClientProps = HomePageUnauthenticatedServerProps & {
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const NUMBER_FOLDS = 5;
const SCROLLING_DEBOUNCING_TIME_MS = 1500;

const HomePageUnauthenticatedClient = ({
  errorCode,
  labels,
}: HomePageUnauthenticatedClientProps) => {
  // The labels for the LoginForm and the SignupForm need to be passed down both to the header and the fifth fold:
  const headerLabels = {
    commons: labels.commons,
    component: {
      ...labels.component.Header,
      LoginForm: labels.component.LoginForm,
      SignupForm: labels.component.SignupForm,
    },
  };

  const fifthFoldLabels = {
    commons: labels.commons,
    component: {
      ...labels.component.FifthFold,
      LoginForm: labels.component.LoginForm,
      SignupForm: labels.component.SignupForm,
    },
  };

  // This will be needed to scroll back to the top of the page in the `useEffect` hook of the <FithFold /> child component,
  // Otherwise, for some reason, browsers scroll down to the <FifthFold /> component and focus on the first input of the
  // <SignupForm /> it renders on page load.
  const heroRef = useRef(null);

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
        <div className={styles.hero} ref={heroRef}>
          <HeaderUnauthenticated labels={headerLabels} />
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
        <FifthFold heroRef={heroRef} labels={fifthFoldLabels} />
      </div>
    </main>
  );
};

export default HomePageUnauthenticatedClient;
