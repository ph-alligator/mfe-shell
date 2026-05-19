/**
 * Shared Module Federation config — import from shell and all remotes.
 */
export const federationShared = {
  react: {
    singleton: true,
    requiredVersion: '^18.3.1',
    strictVersion: false,
  },
  'react-dom': {
    singleton: true,
    requiredVersion: '^18.3.1',
    strictVersion: false,
  },
  'react-router-dom': {
    singleton: true,
    requiredVersion: '^6.28.0',
    strictVersion: false,
  },
};
