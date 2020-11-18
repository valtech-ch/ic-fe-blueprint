/*jshint esversion: 6 */
const input = 'src';
const output = 'dist';
const includes = '_components';

module.exports = function (config) {
  return {
      dir: {
          input,
          output,
          includes
      },
      // Add all extensions to be exported to the output folder
      templateFormats: ['njk', 'md', 'html', 'yml', 'svg', 'png', 'jpg'],
  };
};