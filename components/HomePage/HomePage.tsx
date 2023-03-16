import { useState } from "react";
import { UserInformation } from "../Header/AccountOptionsFlyout";
import HeaderLoggedIn from "../Header/HeaderLoggedIn";
import HeaderNotLoggedIn from "../Header/HeaderNotLoggedIn";
import HomePageContentNotLoggedIn from "./HomePageContentNotLoggedIn";
import HomePageContentLoggedIn from "./HomePageContentLoggedIn";
import LoginForm, { LoginFormProps } from "../LoginForm/LoginForm";
import OverlayModal from "../OverlayModal/OverlayModal";
import styles from "./HomePage.module.css";

export type HomePageProps = {
  isLoggedIn: boolean;
  userInformation?: UserInformation;
};

const HomePage = ({ isLoggedIn, userInformation }: HomePageProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleClickSignInButton = () => {
    setIsLoginModalOpen(true);
  };

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div>
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
      <header className={styles.header}>
        {isLoggedIn ? (
          <HeaderLoggedIn
            userInformation={userInformation as UserInformation}
          />
        ) : (
          <HeaderNotLoggedIn
            handleClickSignInButton={handleClickSignInButton}
          />
        )}
      </header>
      <main>
        {isLoggedIn ? (
          <HomePageContentLoggedIn />
        ) : (
          <HomePageContentNotLoggedIn />
        )}
      </main>
    </div>
  );
};

export default HomePage;
