import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import LoginForm, { LoginFormProps } from "../LoginForm/LoginForm";
import OverlayModal from "../OverlayModal/OverlayModal";
import styles from "./HomePageUnauthenticated.module.css";
import PictureSlider from "./PictureSlider";

const NUMBER_FOLDS = 2;

const HomePageUnauthenticated = () => {
  const intl = useIntl();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentFold, setCurrentFold] = useState(1);

  const handleClickSignInButton = () => {
    setIsLoginModalOpen(true);
  };

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleMouseWheel = (event: any) => {
    let newFold = currentFold;

    if (event.wheelDelta < 0 && currentFold !== NUMBER_FOLDS) {
      newFold = currentFold + 1;
    } else if (event.wheelDelta > 0 && currentFold > 1) {
      newFold = currentFold - 1;
    }

    if (newFold !== currentFold) {
      setCurrentFold(newFold);
    }
  };

  const handleCarretClick = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  useEffect(() => {
    document.addEventListener("mousewheel", handleMouseWheel);

    return () => {
      document.removeEventListener("mousewheel", handleMouseWheel);
    };
  });

  return (
    <div className={styles.container}>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleModalClose}>
          <LoginForm
            {
              ...({ onLoginSuccess: handleModalClose } as LoginFormProps)
              /* setIsLoading will be injected by <OverlayModal />*/
            }
          />
        </OverlayModal>
      )}
      <div
        className={styles.content}
        style={{ transform: `translateY(-${(currentFold - 1) * 100}vh)` }}
      >
        <div className={styles.hero}>
          <HeaderUnauthenticated
            handleClickSignInButton={handleClickSignInButton}
          />
          <div className={styles.pictureSlider}>
            <PictureSlider onCarretClick={handleCarretClick} />
          </div>
        </div>
        <div className={styles.sectionSearch}>
          <div className={styles.sectionSearchPicturesContainer}></div>
          <div className={styles.sectionSearchTextContainer}>
            <div className={styles.sectionSearchHeader}>
              {intl.formatMessage({ id: "SEARCH_FOR_AN_IDEA" })}
            </div>
            <div className={styles.sectionSearchParagraph}>
              {intl.formatMessage({ id: "WHAT_DO_YOU_WANT_TO_TRY_NEXT" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageUnauthenticated;
