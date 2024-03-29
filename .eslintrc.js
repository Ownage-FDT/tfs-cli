module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:mocha/recommended',
        'plugin:unicorn/recommended'
    ],

    plugins: ['@typescript-eslint/eslint-plugin', 'mocha', 'unicorn'],
    env: {
        node: true
    },
    root: true,
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-module': 'warn',
        'unicorn/numeric-separators-style': 'off',
        'mocha/no-setup-in-describe': 'off'
    }
}
