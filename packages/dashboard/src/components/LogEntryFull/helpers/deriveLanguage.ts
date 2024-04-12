/* eslint-disable no-fallthrough */

export const deriveLanguage = (key: string) => {
  switch (key) {
    case 'request':

    case 'filteredRequest':

    case 'parsedRequest': {
      return 'graphql';
    }

    case 'variables':

    case 'value':

    case 'result': {
      return 'json';
    }

    default: {
      return 'javascript';
    }
  }
};
