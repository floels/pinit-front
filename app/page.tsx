"use client";

import { useContext } from "react";
import GlobalStateContext from "./globalState";
import HomePageUnauthenticated from "../components/HomePage/HomePageUnauthenticated";
import HomePageAuthenticated from "../components/HomePage/HomePageAuthenticated";

export default function HomePage() {
  const { state } = useContext(GlobalStateContext);

  return state.isAuthenticated ? (
    <HomePageAuthenticated />
  ) : (
    <HomePageUnauthenticated />
  );
}
