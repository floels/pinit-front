module.exports = {
  launch: {
    headless: process.env.HEADLESS === "false" ? false : "new",
    devtools: process.env.HEADLESS === "false",
  },
};
