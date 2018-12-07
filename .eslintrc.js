module.exports = {
    root: true,
    env: {
        es6: true,
        browser: true,
        node: true,
        mocha: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: '2018',
    },
    extends: [
        'plugin:vue/strongly-recommended',
        'plugin:vue-types/strongly-recommended',
        'eslint:recommended',
        'prettier/vue',
    ],
    // required to lint *.vue files
    plugins: ['vue', 'vue-types'],
    // add your custom rules here
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4, { "SwitchCase": 1 }],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'eol-last': ['error', 'always'],
        'comma-dangle': ['warn', 'always-multiline'],
        'vue/html-indent': ['warn', 4],
        'no-tabs': ['error', { allowIndentationTabs: true }],
    },
};
