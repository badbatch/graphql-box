declare const macro: (path: TemplateStringsArray) => string;
// default export required for Babel macro interface
// eslint-disable-next-line import-x/no-default-export
export default macro;
export = macro;
