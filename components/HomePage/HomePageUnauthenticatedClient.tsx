"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import PictureSlider from "./PictureSlider";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import styles from "./HomePageUnauthenticatedClient.module.css";
import { HomePageUnauthenticatedServerProps } from "./HomePageUnauthenticatedServer";
import { ERROR_CODE_FETCH_FAILED } from "@/lib/constants";
import SecondFold from "./SecondFold";

type HomePageUnauthenticatedClientProps = HomePageUnauthenticatedServerProps & {
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const NUMBER_FOLDS = 2;

const HomePageUnauthenticatedClient = ({
  errorCode,
  labels,
}: HomePageUnauthenticatedClientProps) => {
  const [currentFold, setCurrentFold] = useState(1);

  const handleClickSeeBelow = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  useEffect(() => {
    const handleMouseWheel = (event: WheelEvent) => {
      let newFold = currentFold;
  
      if (event.deltaY > 0 && currentFold !== NUMBER_FOLDS) {
        newFold = currentFold + 1;
      } else if (event.deltaY < 0 && currentFold > 1) {
        newFold = currentFold - 1;
      }
  
      if (newFold !== currentFold) {
        setCurrentFold(newFold);
      }
    };

    document.addEventListener("wheel", handleMouseWheel);

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, [currentFold]);

  useEffect(() => {
    if (errorCode === ERROR_CODE_FETCH_FAILED) {
      toast.warn(labels.commons.CONNECTION_ERROR);
    }
  }, [errorCode, labels]);

  return (
    <main className={styles.container}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
      />
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
              onClickSeeBelow={handleClickSeeBelow}
              labels={labels.component.PictureSlider}
            />
          </div>
        </div>
        <SecondFold labels={labels.component.SecondFold} />
      </div>
    </main>
  );
};

export default HomePageUnauthenticatedClient;
