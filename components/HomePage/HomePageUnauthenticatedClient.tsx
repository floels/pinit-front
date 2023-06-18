"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PictureSlider from "./PictureSlider";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import styles from "./HomePageUnauthenticatedClient.module.css";
import { HomePageUnauthenticatedServerProps } from "./HomePageUnauthenticatedServer";
import { ERROR_CODE_FETCH_FAILED } from "@/lib/constants";

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
  }, [errorCode]);

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
        <div className={styles.sectionSearch}>
          <div className={styles.sectionSearchPicturesArea}>
            <div className={styles.sectionSearchPicturesContainer}>
              <div className={styles.sectionSearchPictureLeftContainer}>
                <Image
                  src="https://s.pinimg.com/webapp/left-511a9304.png"
                  alt="chicken-plate"
                  fill
                  sizes="204px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureTopRightContainer}>
                <Image
                  src="https://s.pinimg.com/webapp/topRight-d0230035.png"
                  alt="chicken-plate"
                  fill
                  sizes="178px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureBottomRightContainer}>
                <Image
                  src="https://s.pinimg.com/webapp/right-88044782.png"
                  alt="chicken-plate"
                  fill
                  sizes="164px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureCenterContainer}>
                <Image
                  src="https://s.pinimg.com/webapp/center-77497603.png"
                  alt="chicken-plate"
                  fill
                  sizes="298px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <a href="#" className={styles.searchBarLink}>
                <FontAwesomeIcon
                  icon={faSearch}
                  className={styles.searchBarLinkIcon}
                />
                {labels.component.EASY_CHICKEN_DINNER}
              </a>
            </div>
          </div>
          <div className={styles.sectionSearchTextArea}>
            <div className={styles.sectionSearchTextContainer}>
              <div className={styles.sectionSearchHeader}>
                {labels.component.SEARCH_FOR_AN_IDEA}
              </div>
              <div className={styles.sectionSearchParagraph}>
                {labels.component.WHAT_DO_YOU_WANT_TO_TRY_NEXT}
              </div>
              <a href="#" className={styles.exploreLink}>
                {labels.component.EXPLORE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePageUnauthenticatedClient;
