"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import PictureSlider from "./PictureSlider";
import styles from "./LandingPageContent.module.css";
import { ERROR_CODE_CLIENT_FETCH_FAILED } from "@/lib/constants";
import SecondFold from "./SecondFold";
import ThirdFold from "./ThirdFold";
import FourthFold from "./FourthFold";
import FifthFold from "./FifthFold";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";

export type LandingPageProps = {
  errorCode?: string;
};

const NUMBER_FOLDS = 5;
const SCROLLING_DEBOUNCING_TIME_MS = 80;

const LandingPage = ({ errorCode }: LandingPageProps) => {
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
      toast.warn(t("CONNECTION_ERROR"), {
        toastId: "toast-id-connection-error",
      });
    } else if (errorCode) {
      toast.warn(t("UNFORESEEN_ERROR"), {
        toastId: "toast-id-unforeseen-error",
      });
    }
  }, [errorCode, t]);

  return (
    <main className={styles.container}>
      <div
        className={styles.content}
        style={{ transform: `translateY(-${(currentFold - 1) * 100}vh)` }}
        data-testid="homepage-unauthenticated-content"
      >
        <div className={styles.hero} ref={heroRef}>
          <HeaderUnauthenticated
            handleClickLogInButton={openLogInModal}
            handleClickSignUpButton={openSignUpModal}
          />
          <div className={styles.pictureSlider}>
            <PictureSlider onClickSeeBelow={handleClickHeroSeeBelow} />
          </div>
        </div>
        <SecondFold handleClickExploreButton={openSignUpModal} />
        <ThirdFold handleClickExploreButton={openSignUpModal} />
        <FourthFold handleClickExploreButton={openSignUpModal} />
        <FifthFold heroRef={heroRef} onClickBackToTop={handleClickBackToTop} />
      </div>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm onClickNoAccountYet={handleClickNoAccountYet} />
        </OverlayModal>
      )}
      {isSignupModalOpen && (
        <OverlayModal onClose={handleCloseSignupModal}>
          <SignupForm
            onClickAlreadyHaveAccount={handleClickAlreadyHaveAccount}
          />
        </OverlayModal>
      )}
    </main>
  );
};

export default LandingPage;
