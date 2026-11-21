import pkg from '../package.json';

// Single source of truth: bump "version" in client/package.json to release.
export const APP_VERSION = pkg.version;
