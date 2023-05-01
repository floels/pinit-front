// https://next-intl-docs.vercel.app/docs/next-13/server-components#middlewarets
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en"],
  defaultLocale: "en",
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
