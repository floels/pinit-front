"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ERROR_CODE_CLIENT_FETCH_FAILED } from "@/lib/constants";
import LandingPageClient, {
  LandingPageClientProps,
} from "../LandingPage/LandingPageClient";

type AccessTokenRefresherClientProps = LandingPageClientProps;

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
    }

    // Whether the token refresh succeeded or not, we go back to the base route:
    router.push("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    refreshTokenAndRefreshRoute();
  }, [refreshTokenAndRefreshRoute]);

  if (fetchFailed) {
    return (
      <LandingPageClient
        errorCode={ERROR_CODE_CLIENT_FETCH_FAILED}
        labels={labels}
      />
    );
  }

  return null;
};

export default AccessTokenRefresherClient;
