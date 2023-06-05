import { cookies } from "next/headers";
import HomePageUnauthenticatedServer from "@/components/HomePage/HomePageUnauthenticatedServer";
import HomePageAuthenticatedServer from "@/components/HomePage/HomePageAuthenticatedServer";

const HomePage = () => {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    {/* https://beta.nextjs.org/docs/data-fetching/fetching#asyncawait-in-server-components */}
    {/* An async Server Components will cause a 'Promise<Element>' is not a valid JSX element type error where it is used.
      This is a known issue with TypeScript and is being worked on upstream. */}
    {/* @ts-expect-error Async Server Component */}
    return <HomePageAuthenticatedServer accessToken={accessToken.value} />;
  }

  return <HomePageUnauthenticatedServer />;
};

export default HomePage;
