// https://next-intl-docs.vercel.app/docs/next-13/server-components#nextconfigjs
const withNextIntl = require("next-intl/plugin")("./i18n.ts");

module.exports = withNextIntl({
  // https://nextjs.org/docs/api-reference/next/image#remote-patterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s.pinimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
});
