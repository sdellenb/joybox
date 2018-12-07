module.exports = {
  root: true,
  env: {
	  es6: true,
    browser: true,
    node: true,
	  mocha: true
  },
  parserOptions: {
    parser: 'babel-eslint',
  	ecmaVersion: '2017',
	  // sourceType: module, // Crashes eslint.
	  ecmaFeatures: {
	    experimentalObjectRestSpread: true
	  }
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vue-types/strongly-recommended',
	  'eslint:recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'vue-types',
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  indent: ['error', 4],
	  quotes: ['error', 'single'],
	  semi: ['error', 'always'],
    'eol-last': ['error', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'vue/html-indent': ['warn', 4]
  }
}
