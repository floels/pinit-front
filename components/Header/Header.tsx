import { cookies } from "next/headers";
import HeaderAuthenticatedServer from "./HeaderAuthenticatedServer";
import {
  ENDPOINT_USER_DETAILS,
  ERROR_CODE_INVALID_ACCESS_TOKEN,
} from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetchUtils";
import AccessTokenRefresher from "../AccessTokenRefresher/AccessTokenRefresher";

const fetchUserDetails = async (accessToken: string) => {
  let userDetails, errorCode;

  try {
    userDetails = await fetchWithAuthentication({
      endpoint: ENDPOINT_USER_DETAILS,
      accessToken,
    });
  } catch (error) {
    errorCode = (error as Error).message;
  }

  return { userDetails, errorCode };
};

const Header = async () => {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    const { userDetails, errorCode } = await fetchUserDetails(
      accessToken.value
    );

    if (errorCode === ERROR_CODE_INVALID_ACCESS_TOKEN) {
      return <AccessTokenRefresher />;
    }

    return (
      <HeaderAuthenticatedServer
        userDetails={userDetails}
        errorCode={errorCode}
      />
    );
  }

  // No access token: we are not unauthenticated.
  // <HeaderUnauthenticated /> will be rendered by <HomePageUnauthenticated /> (more convenient to have both in the same component to handle scrolling effect)
  return null;
};

export default Header;
