module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
  ],
  plugins: ['react'],
  rules: {
    'react-hooks/exhaustive-deps': ['off'],
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
