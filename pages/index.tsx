import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import HomePageUnauthenticated, {
  HomePageProps,
} from "@/components/HomePage/HomePageUnauthenticated";
import { useState } from "react";

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
        isLoggedIn: false,
      },
    };
  }

  const userInformation = await fetchUserInformation(accessToken);

  return {
    props: {
      isLoggedIn: true,
      userInformation,
    },
  };
};

export default function Home(props: HomePageProps) {
  const { isLoggedIn, userInformation } = props;

  return (
    <>
      <Head>
        <title>PinIt</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div>
        {isLoggedIn ? (
          <HomePageAuthenticated userInformation={userInformation} />
        ) : (
          <HomePageUnauthenticated />
        )}
      </div>
    </>
  );
}
