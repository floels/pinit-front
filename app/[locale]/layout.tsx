// https://fontawesome.com/v5/docs/web/use-with/react#next-js
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// https://next-intl-docs.vercel.app/docs/next-13/server-components#applocalelayouttsx
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

import Header from "@/components/Header/Header";

import "@/styles/globals.css";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const metadata = {
  title: "PinIt",
  description: "Welcome to PinIt!",
  icons: {
    icon: "/images/favicon.ico",
  }
};

const Layout = ({ children, params }: Props) => {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        {/* https://beta.nextjs.org/docs/data-fetching/fetching#asyncawait-in-server-components */}
        {/* An async Server Components will cause a 'Promise<Element>' is not a valid JSX element type error where it is used.
          This is a known issue with TypeScript and is being worked on upstream. */}
        {/* @ts-expect-error Async Server Component */}
        <Header />
        {children}
      </body>
    </html>
  );
};

export default Layout;
