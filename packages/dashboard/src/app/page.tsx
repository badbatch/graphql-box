const Page = (props: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> }) => {
  return <h1>My Page</h1>;
};

// nextjs requires this to be default export
// eslint-disable-next-line import/no-default-export
export default Page;
