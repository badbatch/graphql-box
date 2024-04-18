const { semverGroups, ...otherConfig } = require('@repodog/syncpack-config');

module.exports = {
  ...otherConfig,
  semverGroups: [
    {
      dependencies: ['next'],
      range: '',
    },
    ...semverGroups,
  ],
};
