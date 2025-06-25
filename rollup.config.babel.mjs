import babelConfig from '@repodog/babel-config/rollup';
import rollupConfig from '@repodog/rollup-config';
import { babel as babelPlugin } from '@rollup/plugin-babel';

// rollup requires default export
// eslint-disable-next-line import-x/no-default-export
export default {
  ...rollupConfig({ compiler: babelPlugin(babelConfig) }),
};
