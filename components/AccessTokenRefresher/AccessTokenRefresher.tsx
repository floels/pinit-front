"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ERROR_CODE_CLIENT_FETCH_FAILED } from "@/lib/constants";
import LandingPage from "../LandingPage/LandingPage";

const AccessTokenRefresher = () => {
  const [fetchFailed, setFetchFailed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const refreshTokenAndRefreshRoute = useCallback(async () => {
    let response;

    try {
      response = await fetch("/api/user/refresh-token", {
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
      // Refresh token is expired: logout and go back to base route:
      await fetch("/api/user/log-out", {
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

  return null;
};

export default AccessTokenRefresher;
