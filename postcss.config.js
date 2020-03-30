const postcssPresetEnv = require('postcss-preset-env');

module.exports = (ctx) => ({
  map: false,
  plugins: [
    postcssPresetEnv({
      stage: 0,
    }),
  ],
});
