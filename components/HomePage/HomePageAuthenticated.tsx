import { UserInformation } from "../Header/AccountOptionsFlyout";
import HeaderAuthenticated from "../Header/HeaderAuthenticated";

type HomePageAuthenticatedProps = {
  userInformation: UserInformation;
};

const HomePageAuthenticated = ({
  userInformation,
}: HomePageAuthenticatedProps) => {
  return (
    <div>
      <HeaderAuthenticated userInformation={userInformation} />
      <main></main>
    </div>
  );
};

export default HomePageAuthenticated;
