module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
  ],
  plugins: [
    'react',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'react-hooks/exhaustive-deps': ['off'],
    'indent': ['warn', 2, {
      ignoredNodes: ['TemplateLiteral'],
    }],
    'object-property-newline': ['error'],
    'comma-dangle': ['warn', 'always-multiline'],
    'react/jsx-first-prop-new-line': [
      1, 'multiline',
    ],
    'react/jsx-max-props-per-line': [
      1,
      {
        maximum: 1,
      },
    ],
    'react/jsx-closing-bracket-location': [
      1, 'line-aligned',
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
  },
};
