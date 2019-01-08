/* eslint-env node */
module.exports = {
  'globDirectory': '.',
  'globPatterns': [
    '**/*.{css,js,svg,jpg,webp,png,html,json}',
  ],
  'swDest': 'service-worker.js',
  'swSrc': 'service-worker.src.js',
};
