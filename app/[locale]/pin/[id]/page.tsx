import { API_BASE_URL, API_ENDPOINT_PIN_DETAILS } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  params: { id: string };
};

const Page = async ({ params }: PageProps) => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    redirect("/");
  }

  const pinID = params.id;

  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_PIN_DETAILS}/${pinID}/`,
  );

  const data = await response.json();

  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
