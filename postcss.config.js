const postcssPresetEnv = require('postcss-preset-env');

module.exports = () => ({
  map: false,
  plugins: [
    postcssPresetEnv({
      stage: 0,
    }),
  ],
});
