"use client";

import { useState } from "react";

import AccessTokenRefresher from "./AccessTokenRefresher";

const AuthenticatedSetupBuilder = () => {
  const [isFetchingRefreshedToken, setIsFetchingRefreshedToken] =
    useState(true);

  const handleFinishedFetchingRefreshToken = () => {
    setIsFetchingRefreshedToken(false);
  };

  if (isFetchingRefreshedToken) {
    return (
      <AccessTokenRefresher
        handleFinishedFetching={handleFinishedFetchingRefreshToken}
      />
    );
  }

  return null; // TODO: return <AccountDetailsFetcher />
};

export default AuthenticatedSetupBuilder;
