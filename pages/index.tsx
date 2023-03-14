import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import Header from "@/components/Header/Header";
import { UserInfo } from "@/components/Header/AccountOptionsFlyout";

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

  const responseRedirect = {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };

  if (!accessToken) {
    return responseRedirect;
  }

  const userInformation = await fetchUserInformation(accessToken);

  return {
    props: { userInformation },
  };
};

type HomeProps = {
  userInfo: UserInfo;
};

export default function Home(props: HomeProps) {
  return (
    <>
      <Head>
        <title>Pint</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header {...props.userInfo} />
      </main>
    </>
  );
}
