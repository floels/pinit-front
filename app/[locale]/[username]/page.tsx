import { API_BASE_URL, API_ENDPOINT_ACCOUNT_DETAILS } from "@/lib/constants";
import AccountDetailsView from "@/components/AccountDetailsView/AccountDetailsView";
import { Response404Error, ResponseKOError } from "@/lib/customErrors";
import ErrorView from "@/components/ErrorView/ErrorView";
import { serializeAccountPublicDetails } from "@/lib/utils/serializers";

type PageProps = {
  params: { username: string };
};

const fetchAccountDetails = async ({ username }: { username: string }) => {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_ACCOUNT_DETAILS}/${username}/`,
  );

  if (response.status === 404) {
    throw new Response404Error();
  }

  if (!response.ok) {
    throw new ResponseKOError();
  }

  const responseData = await response.json();

  return serializeAccountPublicDetails(responseData);
};

const Page = async ({ params }: PageProps) => {
  const username = params.username;

  let accountDetails;

  try {
    accountDetails = await fetchAccountDetails({ username });
  } catch (error) {
    if (error instanceof Response404Error) {
      return (
        <ErrorView errorMessageKey="AccountDetails.ERROR_ACCOUNT_NOT_FOUND" />
      );
    }

    return (
      <ErrorView errorMessageKey="AccountDetails.ERROR_FETCH_ACCOUNT_DETAILS" />
    );
  }

  return <AccountDetailsView {...accountDetails} />;
};

export default Page;
