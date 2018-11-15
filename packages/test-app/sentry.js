const Sentry = require('@sentry/electron');
const { ElectronOptOut } = require('sentry-electron-opt-out');
const { ElectronUserID } = require('sentry-electron-user-id');
const { ElectronClientScrubber } = require('sentry-electron-client-scrubber');

Sentry.init({
  dsn: 'https://64cf7b47cd694330b1b42fdd71e50d31@sentry.io/1323989',
  debug: true,
  integrations: integrations => [
    ...integrations,
    new ElectronUserID(),
    new ElectronOptOut(),
    new ElectronClientScrubber([/(user|users|home)([\/\\])[^\/\\]+/gi, '$1$2...']),
  ],
});
