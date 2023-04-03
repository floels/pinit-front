import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import LoginForm, { LoginFormProps } from "../LoginForm/LoginForm";
import OverlayModal from "../OverlayModal/OverlayModal";
import styles from "./HomePageUnauthenticated.module.css";
import PictureSlider from "./PictureSlider";
import SignupForm, { SignupFormProps } from "../SignupForm/SignupForm";

const NUMBER_FOLDS = 2;

const HomePageUnauthenticated = () => {
  const intl = useIntl();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [currentFold, setCurrentFold] = useState(1);

  const handleClickLoginButton = () => {
    setIsLoginModalOpen(true);
  };

  const handleClickSignUpButton = () => {
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

  const handleClickSeeBelow = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  useEffect(() => {
    document.addEventListener("wheel", handleMouseWheel);

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  });

  return (
    <div className={styles.container}>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm
            {
              ...({
                onLoginSuccess: handleCloseLoginModal,
                onClickNoAccountYet: handleClickNoAccountYet,
              } as LoginFormProps)
              /* setIsLoading will be injected by <OverlayModal />*/
            }
          />
        </OverlayModal>
      )}
      {isSignupModalOpen && (
        <OverlayModal onClose={handleCloseSignupModal}>
          <SignupForm
            {
              ...({
                onSignupSuccess: handleCloseSignupModal,
                onClickAlreadyHaveAccount: handleClickAlreadyHaveAccount,
              } as SignupFormProps)
              /* setIsLoading will be injected by <OverlayModal />*/
            }
          />
        </OverlayModal>
      )}
      <div
        className={styles.content}
        style={{ transform: `translateY(-${(currentFold - 1) * 100}vh)` }}
        data-testid="homepage-unauthenticated-content"
      >
        <div className={styles.hero}>
          <HeaderUnauthenticated
            handleClickLoginButton={handleClickLoginButton}
            handleClickSignUpButton={handleClickSignUpButton}
          />
          <div className={styles.pictureSlider}>
            <PictureSlider onClickSeeBelow={handleClickSeeBelow} />
          </div>
        </div>
        <div className={styles.sectionSearch}>
          <div className={styles.sectionSearchPicturesArea}>
            <div className={styles.sectionSearchPicturesContainer}>
              <div className={styles.sectionSearchPictureLeftContainer}>
                <Image
                  src="/images/landing/landing_search_left.jpeg"
                  alt="chicken-plate"
                  fill
                  sizes="204px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureTopRightContainer}>
                <Image
                  src="/images/landing/landing_search_top_right.jpeg"
                  alt="chicken-plate"
                  fill
                  sizes="178px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureBottomRightContainer}>
                <Image
                  src="/images/landing/landing_search_bottom_right.jpeg"
                  alt="chicken-plate"
                  fill
                  sizes="164px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureCenterContainer}>
                <Image
                  src="/images/landing/landing_search_center.jpeg"
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
                {intl.formatMessage({ id: "EASY_CHICKEN_DINNER" })}
              </a>
            </div>
          </div>
          <div className={styles.sectionSearchTextArea}>
            <div className={styles.sectionSearchTextContainer}>
              <div className={styles.sectionSearchHeader}>
                {intl.formatMessage({ id: "SEARCH_FOR_AN_IDEA" })}
              </div>
              <div className={styles.sectionSearchParagraph}>
                {intl.formatMessage({ id: "WHAT_DO_YOU_WANT_TO_TRY_NEXT" })}
              </div>
              <a href="#" className={styles.exploreLink}>
                {intl.formatMessage({ id: "EXPLORE" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageUnauthenticated;
