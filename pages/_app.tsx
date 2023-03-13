import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { IntlProvider } from "react-intl";
import English from "../lang/en.json";

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
