import { useContext } from "react";
import GlobalStateContext from "../../app/globalState";
import HeaderAuthenticated from "./HeaderAuthenticated";
import HeaderUnauthenticated from "./HeaderUnauthenticated";

const Header = () => {
  const { state } = useContext(GlobalStateContext);

  return state.isAuthenticated ? (
    <HeaderAuthenticated />
  ) : (
    <HeaderUnauthenticated />
  );
};

export default Header;
