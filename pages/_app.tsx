import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { IntlProvider } from "react-intl";
import English from "../lang/en.json";

// See https://fontawesome.com/v5/docs/web/use-with/react#next-js
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  const { locale, defaultLocale } = useRouter();

  const messages = useMemo(() => {
    switch (locale) {
      case "en":
        return English;
      default:
        return English;
    }
  }, [locale]);

  return (
    <IntlProvider
      locale={locale as string}
      defaultLocale={defaultLocale}
      messages={messages as Record<string, string>}
    >
      <Component {...pageProps} />
    </IntlProvider>
  );
}
