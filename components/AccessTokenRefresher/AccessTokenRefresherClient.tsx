"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ERROR_CODE_CLIENT_FETCH_FAILED } from "@/lib/constants";
import HomePageUnauthenticatedClient, {
  HomePageUnauthenticatedClientProps,
} from "../HomePageUnauthenticated/HomePageUnauthenticatedClient";

type AccessTokenRefresherClientProps = HomePageUnauthenticatedClientProps;

const AccessTokenRefresherClient = ({
  labels,
}: AccessTokenRefresherClientProps) => {
  const [fetchFailed, setFetchFailed] = useState(false);

  const router = useRouter();

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
      // Refresh token is expired: logout and refresh page
      await fetch("/api/user/log-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      window.location.reload();
    }

    // Token refresh succeeded: refresh current route
    router.refresh();
  }, [router]);

  useEffect(() => {
    refreshTokenAndRefreshRoute();
  }, [refreshTokenAndRefreshRoute]);

  if (fetchFailed) {
    return (
      <HomePageUnauthenticatedClient
        errorCode={ERROR_CODE_CLIENT_FETCH_FAILED}
        labels={labels}
      />
    );
  }

  return null;
};

export default AccessTokenRefresherClient;
