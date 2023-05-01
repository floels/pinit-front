import { cookies } from "next/headers";
import HomePageUnauthenticatedServer from "@/components/HomePage/HomePageUnauthenticatedServer";
import HomePageAuthenticated from "@/components/HomePage/HomePageAuthenticated";

const fetchHomePageData = async (accessToken: string) => {
  // TODO: implement data fetching
  return {};
};

const HomePage = async () => {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    const homePageData = await fetchHomePageData(accessToken.value);

    return <HomePageAuthenticated />;
  }

  return <HomePageUnauthenticatedServer />;
};

export default HomePage;
