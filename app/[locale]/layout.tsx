// https://fontawesome.com/v5/docs/web/use-with/react#next-js
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// https://next-intl-docs.vercel.app/docs/next-13/server-components#applocalelayouttsx
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

// https://fkhadra.github.io/react-toastify/installation#the-gist
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { cookies } from "next/headers";
import HeaderAuthenticatedServer from "@/components/HeaderAuthenticated/HeaderAuthenticatedServer";

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
  },
};

const Layout = ({ children, params }: Props) => {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  const accessTokenCookie = cookies().get("accessToken");

  const isAuthenticated = !!accessTokenCookie;

  return (
    <html lang={locale}>
      <body>
        <ToastContainer position="bottom-left" autoClose={5000} />
        {/*  If user is not authenticated, the header will be rendered with <LandingPageClient /> */}
        {isAuthenticated && <HeaderAuthenticatedServer />}
        {children}
      </body>
    </html>
  );
};

export default Layout;
