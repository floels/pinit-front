import { cookies } from "next/headers";
import HeaderAuthenticatedServer from "./HeaderAuthenticatedServer";
import { API_BASE_URL, ENDPOINT_USER_DETAILS } from "@/lib/constants";

const fetchUserDetails = async (accessToken: string) => {
  const response = await fetch(`${API_BASE_URL}/${ENDPOINT_USER_DETAILS}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    // TODO: display error in UI instead of throwing
    throw new Error("Failed to fetch user details");
  }

  const {
    email,
    initial,
    first_name: firstName,
    last_name: lastName,
  } = await response.json();

  return { email, initial, firstName, lastName };
};

const Header = async () => {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    const userDetails = await fetchUserDetails(accessToken.value);

    return <HeaderAuthenticatedServer userDetails={userDetails} />;
  }

  return null;
  // NB: <HeaderUnauthenticated /> will be rendered by <HomePageUnauthenticated /> (more convenient to have both in the same component to handle scrolling effect)
};

export default Header;
