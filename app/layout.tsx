"use client";

import { IntlProvider } from "react-intl";
import en from "../lang/en.json";
import "../styles/globals.css";

// See https://fontawesome.com/v5/docs/web/use-with/react#next-js
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { GlobalStateProvider } from "./globalState";
import Header from "../components/Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "en"; // TODO: base locale on request headers and adapt messages accordingly

  return (
    <IntlProvider
      locale={locale as string}
      messages={en as Record<string, string>}
    >
      <html lang={locale}>
        <head>
          <meta charSet="UTF-8" />
          <title>PinIt</title>
          <meta name="description" content="Welcome to PinIt!" />
          <link
            rel="icon"
            href="/images/favicon.ico"
            type="image/x-icon"
          ></link>
        </head>
        <body>
          <GlobalStateProvider>
            <Header />
            {children}
          </GlobalStateProvider>
        </body>
      </html>
    </IntlProvider>
  );
}
