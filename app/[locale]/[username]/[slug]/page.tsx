import { API_BASE_URL, API_ENDPOINT_BOARD_DETAILS } from "@/lib/constants";
import { Response404Error } from "@/lib/customErrors";
import { serializeBoardWithFullDetails } from "@/lib/utils/serializers";
import { throwIfKO } from "@/lib/utils/fetch";

type PageProps = {
  params: { username: string; slug: string };
};

const fetchBoardDetails = async ({
  username,
  slug,
}: {
  username: string;
  slug: string;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_BOARD_DETAILS}/${username}/${slug}/`,
  );

  if (response.status === 404) {
    throw new Response404Error();
  }

  throwIfKO(response);

  const responseData = await response.json();

  return serializeBoardWithFullDetails(responseData);
};

const Page = async ({ params }: PageProps) => {
  const { username, slug } = params;

  return (
    <div>
      {username} {slug}
    </div>
  );
};

export default Page;
