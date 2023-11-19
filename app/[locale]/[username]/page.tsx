import { API_BASE_URL, API_ENDPOINT_ACCOUNT_DETAILS } from "@/lib/constants";

type PageProps = {
  params: { username: string };
};

const Page = async ({ params }: PageProps) => {
  const username = params.username;

  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_ACCOUNT_DETAILS}/${username}/`,
  );

  const responseData = await response.json();

  const accountDetails = {
    username: responseData.username,
    displayName: responseData.display_name,
    profilePictureURL: responseData.profile_picture_url,
    backgroundPictureURL: responseData.background_picture_url,
    description: responseData.description,
  };

  return <div>{JSON.stringify(accountDetails)}</div>;
};

export default Page;
