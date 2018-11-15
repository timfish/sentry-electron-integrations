const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

require('./sentry');

app.on('ready', () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );
});
