"use client";

import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import GlobalStateContext from "../../app/globalState";
import HeaderAuthenticated from "./HeaderAuthenticated";

const Header = () => {
  const { state, dispatch } = useContext(GlobalStateContext);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch({ type: "SET_IS_AUTHENTICATED", payload: true });
    }
  }, [dispatch]);

  return state.isAuthenticated && <HeaderAuthenticated />;
  // <HeaderUnauthenticated /> will be rendered by <HomePageUnauthenticated /> (more convenient to have both in the same component to handle scrolling effect)
};

export default Header;
