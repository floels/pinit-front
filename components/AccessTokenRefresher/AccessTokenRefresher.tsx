"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  API_ROUTE_LOG_OUT,
  API_ROUTE_REFRESH_TOKEN,
  ERROR_CODE_CLIENT_FETCH_FAILED,
} from "@/lib/constants";
import LandingPage from "../LandingPageContent/LandingPageContent";
import SpinnerBelowHeader from "../Spinners/SpinnerBelowHeader";

const AccessTokenRefresher = () => {
  const [fetchFailed, setFetchFailed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const refreshTokenAndRefreshRoute = useCallback(async () => {
    let response;

    try {
      response = await fetch(API_ROUTE_REFRESH_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      setFetchFailed(true);
      return;
    }

    if (!response.ok) {
      // Refresh token itself is expired: log out and go back to base route:
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (pathname === "/") {
        router.refresh();
      } else {
        router.push("/");
      }
    }

    router.refresh();
  }, [router, pathname]);

  useEffect(() => {
    refreshTokenAndRefreshRoute();
  }, [refreshTokenAndRefreshRoute]);

  if (fetchFailed) {
    return <LandingPage errorCode={ERROR_CODE_CLIENT_FETCH_FAILED} />;
  }

  return <SpinnerBelowHeader />;
};

export default AccessTokenRefresher;
