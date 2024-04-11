import { config as storybookConfig } from '@repodog/storybook-config';
import { type StorybookConfig } from '@storybook/nextjs';

const { addons, ...otherConfig } = storybookConfig();

// storybook swc type conflicts with swc type
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const config = {
  ...otherConfig,
  addons: [...addons, '@bbbtech/storybook-formik/register'],
  stories: [`../src/components/**/*.stories.@(js|jsx|ts|tsx)`],
} as StorybookConfig;

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default config;
