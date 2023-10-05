type PageProps = {
  searchParams: { q: string };
};

const Page = async ({ searchParams }: PageProps) => {
  return searchParams.q;
};

export default Page;
