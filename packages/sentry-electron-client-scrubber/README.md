# sentry-electron-client-scrubber

### Performs regex replace on strings in the Sentry event object.

> **Warning:** The replace is performed recursively on **every** string in the event object. While this gives great
> power, an over zealous regex can easily break fingerprinting and/or sourcemaps!

Pass an array of `[Regex, string]` pairs to the constructor and then pass the integration to Sentry:

```typescript
constructor(...replacements: Array<[RegExp, string]>) {
```

## Example usage

To strip usernames from file paths, in both Electron processes run the following code:

```typescript
const Sentry = require('@sentry/electron');
const { ElectronClientScrubber } = require('sentry-electron-client-scrubber');

Sentry.init({
  dsn: '___YOUR_DSN___',
  integrations: integrations => [
    ...integrations,
    new ElectronClientScrubber([/(users|home)([\/\\])[^\/\\]+/gi, '$1$2...']),
  ],
});
```

This results in the following replacements in strings:

```
C:\Users\tim\Documents\some-file.txt   >   C:\Users\...\Documents\some-file.txt
/home/jambo/another-file.dat           >   /home/.../another-file.dat
```
