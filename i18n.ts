// https://next-intl-docs.vercel.app/docs/next-13/server-components#i18nts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
