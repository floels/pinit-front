import { redirect } from "next/navigation";
import PinDetailsView from "@/components/PinDetailsView/PinDetailsView";
import { API_BASE_URL, API_ENDPOINT_PIN_DETAILS } from "@/lib/constants";
import { getPinWithCamelizedKeys } from "@/lib/utils/misc";
import { Response404Error, ResponseKOError } from "@/lib/customErrors";
import ErrorView from "@/components/ErrorView/ErrorView";

type PageProps = {
  params: { id: string };
};

const fetchPinDetails = async ({ pinId }: { pinId: string }) => {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_PIN_DETAILS}/${pinId}/`,
  );

  if (response.status === 404) {
    throw new Response404Error();
  }

  if (!response.ok) {
    throw new ResponseKOError();
  }

  const responseData = await response.json();

  return getPinWithCamelizedKeys(responseData);
};

const Page = async ({ params }: PageProps) => {
  const pinId = params.id;

  if (!pinId) {
    redirect("/");
  }

  let pinDetails;

  try {
    pinDetails = await fetchPinDetails({ pinId });
  } catch (error) {
    if (error instanceof Response404Error) {
      return <ErrorView errorMessageKey="PinDetails.ERROR_PIN_NOT_FOUND" />;
    }

    return <ErrorView errorMessageKey="PinDetails.ERROR_FETCH_PIN_DETAILS" />;
  }

  return <PinDetailsView pin={pinDetails} />;
};

export default Page;
