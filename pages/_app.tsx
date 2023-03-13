import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";

// Internationalization: see example at https://github.com/vercel/next.js/blob/canary/examples/with-react-intl/pages/_app.tsx
type MessageConfig = Record<string, string>;

export default function App({
  Component,
  pageProps,
}: AppProps<{ intlMessages: MessageConfig }>) {
  const { locale, defaultLocale } = useRouter();
  return (
    <IntlProvider
      locale={locale as string}
      defaultLocale={defaultLocale}
      messages={pageProps.intlMessages}
    >
      <Component {...pageProps} />
    </IntlProvider>
  );
}
