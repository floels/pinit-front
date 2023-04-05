import { UserInformation } from "../Header/AccountOptionsFlyout";
import HeaderAuthenticated from "../Header/HeaderAuthenticated";

type HomePageAuthenticatedProps = {
  userInformation: UserInformation;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const HomePageAuthenticated = ({
  userInformation,
  setIsAuthenticated,
}: HomePageAuthenticatedProps) => {
  return (
    <div>
      <HeaderAuthenticated
        userInformation={userInformation}
        setIsAuthenticated={setIsAuthenticated}
      />
      <main></main>
    </div>
  );
};

export default HomePageAuthenticated;
