// We need to use CommonJS Syntax for Eslint to work with this file
const checkTestNames = require('./check-test-names');

module.exports = {
  rules: {
    'check-test-names': checkTestNames,
  },
};
