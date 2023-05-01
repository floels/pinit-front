// https://next-intl-docs.vercel.app/docs/next-13/server-components#nextconfigjs
const withNextIntl = require("next-intl/plugin")("./i18n.ts");

module.exports = withNextIntl({
  experimental: {
    appDir: true,
  },
  // https://nextjs.org/docs/api-reference/next/image#remote-patterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pinit-staging.s3.eu-west-3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
});
