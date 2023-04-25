// https://fontawesome.com/v5/docs/web/use-with/react#next-js
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// https://next-intl-docs.vercel.app/docs/next-13/client-components#getting-started
import { NextIntlClientProvider } from "next-intl"; // link above imports from "next-intl/client", but that's a mistake
import { notFound } from "next/navigation";

import { GlobalStateProvider } from "../globalState";
import Header from "@/components/Header/Header";

import "@/styles/globals.css";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

// https://next-intl-docs.vercel.app/docs/next-13/client-components#getting-started
export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function RootLayout({ children, params }: Props) {
  // https://next-intl-docs.vercel.app/docs/next-13/client-components#getting-started
  const { locale } = params;
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <title>PinIt</title>
        <meta name="description" content="Welcome to PinIt!" />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon"></link>
      </head>
      <body>
        <GlobalStateProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
          </NextIntlClientProvider>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
