# sentry-electron-opt-out

### A means of opting-out of error reporting from any process

Automated client side error reporting is a great way to fix issues without intervention from users. Some users still
insist on opting-out of this 🤷.

## Example usage

Run the following code in both Electron processes:

```typescript
const Sentry = require('@sentry/electron');
const { ElectronOptOut } = require('sentry-electron-opt-out');

Sentry.init({
  dsn: '__YOUR_DSN__',
  integrations: integrations => [...integrations, new ElectronOptOut()],
});
```

To query or change the state of error reporting, use the following code in any Electron process:

```typescript
const { isEnabled, setEnabled } = require('sentry-electron-opt-out');

// Check if reporting is enabled
const reportingEnabled = await isEnabled();

// Disable error reporting
await setEnabled(false);
```

You can optionally pass a function which can force error reporting to be enabled. Perhaps this is a pre-requisite to
using pre-release versions of you app?

```typescript
// constructor(forceEnabled?: () => Promise<boolean>) {

// Example
const { app } = require('electron');

Sentry.init({
  dsn: '__YOUR_DSN__',
  integrations: integrations => [
    ...integrations,
    new ElectronOptOut(async () => {
      const version = app.getVersion();
      return version.includes('beta') || version.includes('alpha');
    }),
  ],
});
```
