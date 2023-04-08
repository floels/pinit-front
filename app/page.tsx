"use client";

import Cookies from "js-cookie";
import { useState, useEffect, useCallback } from "react";
import HomePageUnauthenticated from "../components/HomePage/HomePageUnauthenticated";
import HomePageAuthenticated from "../components/HomePage/HomePageAuthenticated";
import { UserInformation } from "../components/Header/AccountOptionsFlyout";

async function mockFetchUserInformation(accessToken: string | undefined) {
  // TODO: replace with fetch from actual API endpoint
  return {
    ok: true,
    status: 200,
    json: async () => ({
      username: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    }),
  };
}

export default function Homepage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInformation, setUserInformation] =
    useState<UserInformation | null>(null);

  const fetchUserInformation = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    let responseFetchUserInformation;

    try {
      responseFetchUserInformation = await mockFetchUserInformation(
        Cookies.get("accessToken")
      );

      if (!responseFetchUserInformation.ok) {
        if (responseFetchUserInformation.status === 401) {
          // Tokens are invalid: clear corresponding cookies
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          return;
        } else {
          // unknown error code
          // TODO: show generic error message
          return;
        }
      }

      const fetchedUserInformation = await responseFetchUserInformation.json();

      setUserInformation(fetchedUserInformation);
    } catch (error) {
      // TODO: show generic error message
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserInformation();
  }, [isAuthenticated, fetchUserInformation]);

  return (
    <div>
      {isAuthenticated && userInformation ? (
        <HomePageAuthenticated
          userInformation={userInformation}
          setIsAuthenticated={setIsAuthenticated}
        />
      ) : (
        <HomePageUnauthenticated setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}
