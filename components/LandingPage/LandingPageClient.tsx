"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PictureSlider from "./PictureSlider";
import styles from "./LandingPageClient.module.css";
import { LandingPageServerProps } from "./LandingPageServer";
import { ERROR_CODE_CLIENT_FETCH_FAILED } from "@/lib/constants";
import SecondFold from "./SecondFold";
import ThirdFold from "./ThirdFold";
import FourthFold from "./FourthFold";
import FifthFold from "./FifthFold";
import HeaderUnauthenticatedClient from "./HeaderUnauthenticatedClient";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";

export type LandingPageClientProps = LandingPageServerProps & {
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const NUMBER_FOLDS = 5;
const SCROLLING_DEBOUNCING_TIME_MS = 80;

const LandingPageClient = ({ errorCode, labels }: LandingPageClientProps) => {
  const fifthFoldLabels = {
    commons: labels.commons,
    component: {
      ...labels.component.Content.FifthFold,
      LoginForm: labels.component.LoginForm,
      SignupForm: labels.component.SignupForm,
    },
  };

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

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLogInModal = () => {
    setIsLoginModalOpen(true);
  };

  const openSignUpModal = () => {
    setIsSignupModalOpen(true);
  };

  const handleClickNoAccountYet = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleClickAlreadyHaveAccount = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleClickHeroSeeBelow = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  const handleClickBackToTop = () => {
    setCurrentFold(1);
  };

  useEffect(() => {
    const handleMouseWheel = (event: WheelEvent) => {
      if (!event.deltaY) {
        return;
      }

      const scrollDirection = event.deltaY > 0 ? "down" : "up";

      const dateLastScrollSameDirection = dateLastScroll[scrollDirection];

      const now = new Date();

      let timeElapsedSinceLastScrollSameDirection;

      if (dateLastScrollSameDirection) {
        timeElapsedSinceLastScrollSameDirection =
          now.getTime() - dateLastScrollSameDirection.getTime();
      }

      setDateLastScroll({ ...dateLastScroll, [scrollDirection]: now });

      if (
        timeElapsedSinceLastScrollSameDirection &&
        timeElapsedSinceLastScrollSameDirection < SCROLLING_DEBOUNCING_TIME_MS
      ) {
        // this is not a new scrolling action
        return;
      }

      if (scrollDirection === "down" && currentFold !== NUMBER_FOLDS) {
        setCurrentFold(currentFold + 1);
      } else if (scrollDirection === "up" && currentFold > 1) {
        setCurrentFold(currentFold - 1);
      }
    };

    document.addEventListener("wheel", handleMouseWheel);

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, [currentFold, dateLastScroll, setDateLastScroll]);

  useEffect(() => {
    if (errorCode === ERROR_CODE_CLIENT_FETCH_FAILED) {
      toast.warn(labels.commons.CONNECTION_ERROR, {
        toastId: "toast-id-connection-error",
      });
    } else if (errorCode) {
      toast.warn(labels.commons.UNFORESEEN_ERROR, {
        toastId: "toast-id-unforeseen-error",
      });
    }
  }, [errorCode, labels]);

  return (
    <main className={styles.container}>
      <div
        className={styles.content}
        style={{ transform: `translateY(-${(currentFold - 1) * 100}vh)` }}
        data-testid="homepage-unauthenticated-content"
      >
        <div className={styles.hero} ref={heroRef}>
          <HeaderUnauthenticatedClient
            labels={labels.component.Header}
            handleClickLogInButton={openLogInModal}
            handleClickSignUpButton={openSignUpModal}
          />
          <div className={styles.pictureSlider}>
            <PictureSlider
              onClickSeeBelow={handleClickHeroSeeBelow}
              labels={labels.component.Content.PictureSlider}
            />
          </div>
        </div>
        <SecondFold
          labels={labels.component.Content.SecondFold}
          handleClickExploreButton={openSignUpModal}
        />
        <ThirdFold
          labels={labels.component.Content.ThirdFold}
          handleClickExploreButton={openSignUpModal}
        />
        <FourthFold
          labels={labels.component.Content.FourthFold}
          handleClickExploreButton={openSignUpModal}
        />
        <FifthFold
          heroRef={heroRef}
          onClickBackToTop={handleClickBackToTop}
          labels={fifthFoldLabels}
        />
      </div>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm
            onClickNoAccountYet={handleClickNoAccountYet}
            labels={{
              component: labels.component.LoginForm,
              commons: labels.commons,
            }}
          />
        </OverlayModal>
      )}
      {isSignupModalOpen && (
        <OverlayModal onClose={handleCloseSignupModal}>
          <SignupForm
            onClickAlreadyHaveAccount={handleClickAlreadyHaveAccount}
            labels={{
              component: labels.component.SignupForm,
              commons: labels.commons,
            }}
          />
        </OverlayModal>
      )}
    </main>
  );
};

export default LandingPageClient;
