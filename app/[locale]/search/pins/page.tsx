import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPinThumbnailsFetcherAndRenderer } from "../../page";
import { ENDPOINT_SEARCH_PINS } from "@/lib/constants";

type PageProps = {
  searchParams: { q: string };
};

const Page = async ({ searchParams }: PageProps) => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie || !searchParams.q) {
    redirect("/");
  }

  const accessToken = accessTokenCookie.value;

  const pinSuggestionsFetcherAndRenderer = getPinThumbnailsFetcherAndRenderer(
    `/api/pins/search?q=${searchParams.q}`,
    `${ENDPOINT_SEARCH_PINS}?q=${searchParams.q}`,
  );

  const renderedComponent = await pinSuggestionsFetcherAndRenderer(accessToken);

  return renderedComponent;
};

export default Page;
