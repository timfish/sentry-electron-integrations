# sentry-electron-user-id

### Assigns a unique user id to each app install

If you disable storage of IP addresses in Sentry, you'll notice that you no longer get a count of the number of users
the issue is affecting. IP address can also be an unreliable way to to determine distinct users, especially if you have
a large number of users behind a corporate firewall.

![disable ip storage](https://raw.githubusercontent.com/timfish/sentry-electron-integrations/master/packages/sentry-electron-user-id/disable-ip-storage.png)

## Example usage

In both Electron processes, run the following code:

```typescript
const Sentry = require('@sentry/electron');
const { ElectronUserID } = require('sentry-electron-user-id');

Sentry.init({
  dsn: '__YOUR_DSN__',
  integrations: integrations => [...integrations, new ElectronUserID()],
});
```

If you ever want to renew the user ID, for example if a user would like to restore their anonymity after supplying their
unique ID to technical support. From any process, simply run:

```typescript
const { renewUserId } = require('sentry-electron-user-id');

renewUserId();
```
