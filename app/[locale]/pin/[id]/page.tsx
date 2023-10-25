import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  params: { id: string };
};

const Page = ({ params }: PageProps) => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    redirect("/");
  }

  const pinID = params.id;

  return <div>Pin ID: {pinID}</div>;
};

export default Page;
