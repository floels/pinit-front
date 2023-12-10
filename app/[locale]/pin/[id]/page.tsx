import { redirect } from "next/navigation";
import PinDetailsView from "@/components/PinDetailsView/PinDetailsView";
import { API_BASE_URL, API_ENDPOINT_PIN_DETAILS } from "@/lib/constants";
import { getPinWithCamelizedKeys } from "@/lib/utils/adapters";

type PageProps = {
  params: { id: string };
};

const Page = async ({ params }: PageProps) => {
  const pinID = params.id;

  // A pin ID should be a sequence of 18 digits
  const pinIDPattern = /^\d{18}$/;

  if (!pinIDPattern.test(pinID)) {
    redirect("/");
  }

  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_PIN_DETAILS}/${pinID}/`,
  );

  const responseData = await response.json();

  const pin = getPinWithCamelizedKeys(responseData);

  return <PinDetailsView pin={pin} />;
};

export default Page;
