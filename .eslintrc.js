module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    camelcase: 0,
    'no-unused-vars': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-await-in-loop': 0,
    'max-classes-per-file': 0,
    'prefer-promise-reject-errors': 0
  }
};
