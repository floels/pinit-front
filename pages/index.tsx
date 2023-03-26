import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import HomePageUnauthenticated from "@/components/HomePage/HomePageUnauthenticated";
import HomePageAuthenticated from "@/components/HomePage/HomePageAuthenticated";
import { UserInformation } from "@/components/Header/AccountOptionsFlyout";

type HomePageProps = {
  isAuthenticated: boolean;
  userInformation?: UserInformation;
};

const fetchUserInformation = async (accessToken: string) => {
  // TODO: make an actual API call to retrieve user info
  return {
    username: "john.doe@example.com",
    userFirstName: "John",
    userLastName: "Doe",
  };
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const accessToken = context.req.cookies.accessToken;

  if (!accessToken) {
    return {
      props: {
        isAuthenticated: false,
      },
    };
  }

  const userInformation = await fetchUserInformation(accessToken);

  return {
    props: {
      isAuthenticated: true,
      userInformation,
    },
  };
};

export default function Home(props: HomePageProps) {
  const { isAuthenticated, userInformation } = props;

  return (
    <>
      <Head>
        <title>PinIt</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div>
        {isAuthenticated ? (
          <HomePageAuthenticated
            userInformation={userInformation as UserInformation}
          />
        ) : (
          <HomePageUnauthenticated />
        )}
      </div>
    </>
  );
}
