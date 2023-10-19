import { useParams } from "next/navigation";

type PageProps = {
  params: { id: string };
};

const Page = ({ params }: PageProps) => {
  const pinID = params.id;

  return <div>Pin ID: {pinID}</div>;
};

export default Page;
