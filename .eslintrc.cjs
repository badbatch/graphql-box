module.exports = {
  extends: ['@repodog/eslint-config'],
  overrides: [
    {
      extends: ['@repodog/eslint-config-jasmine'],
      files: ['integration/browser/*.{spec,test}.*'],
    },
    {
      extends: ['@repodog/eslint-config-jest'],
      files: ['packages/**/*.{spec,test}.*', 'integration/node/*.{spec,test}.*'],
      rules: {
        'jest/max-nested-describe': [
          2,
          {
            max: 6,
          },
        ],
      },
    },
    {
      extends: ['@repodog/eslint-config-react'],
      files: ['packages/react/**/*'],
    },
  ],
  parserOptions: {
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    // disabled devDependencies due to https://github.com/import-js/eslint-plugin-import/issues/2168
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
        peerDependencies: false,
      },
    ],
    'unicorn/no-null': 0,
  },
};
