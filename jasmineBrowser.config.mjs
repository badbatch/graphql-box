import config from '@repodog/jasmine-browser-config';

// jasmine requires default export
// eslint-disable-next-line import-x/no-default-export
export default {
  ...config,
  srcDir: 'packages',
};
