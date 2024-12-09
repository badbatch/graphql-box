import config from '@repodog/eslint-config';
import jasmineConfig from '@repodog/eslint-config-jasmine';
import jestConfig from '@repodog/eslint-config-jest';
import reactConfig from '@repodog/eslint-config-react';

// eslint convention is to export default
// eslint-disable-next-line import-x/no-default-export
export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
  },
  ...reactConfig.map(entry => ({
    ...entry,
    files: ['packages/react/**/*'],
  })),
  ...jestConfig.map(entry => ({
    ...entry,
    files: ['**/!(browser)/*.{spec,test}.*'],
  })),
  {
    files: ['tests/node/*.{spec,test}.*'],
    rules: {
      'jest/max-nested-describe': [
        2,
        {
          max: 6,
        },
      ],
    },
  },
  ...jasmineConfig.map(entry => ({
    ...entry,
    files: ['tests/browser/*.{spec,test}.*'],
  })),
];
