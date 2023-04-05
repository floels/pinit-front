"use client";

import { useMemo } from "react";
import { IntlProvider } from "react-intl";
import en from "../lang/en.json";
import "../styles/globals.css";

// See https://fontawesome.com/v5/docs/web/use-with/react#next-js
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "en"; // TODO: base locale on request headers

  const messages = useMemo(() => {
    switch (locale) {
      case "en":
        return en;
      default:
        return en;
    }
  }, [locale]);

  return (
    <IntlProvider
      locale={locale as string}
      messages={messages as Record<string, string>}
    >
      <html lang={locale}>
        <body>{children}</body>
      </html>
    </IntlProvider>
  );
}

export const metadata = {
  title: "PintIt",
};
