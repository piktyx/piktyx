

const electron = require('electron');
// Module to control application life.
const { app } = electron;
const path = require('path');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const globalShortcut = electron.globalShortcut;

const WebView = electron.WebView;
require('electron-context-menu')({
  window: WebView,
  prepend: (params, browserWindow) => [{
    labels: {
      cut: 'Configured Cut',
      copy: 'Configured Copy',
      paste: 'Configured Paste',
      save: 'Configured Save Image',
      copyLink: 'Configured Copy Link',
      inspect: 'Configured Inspect',
    },
    // Only show it when right-clicking images
    visible: params.mediaType === 'image',
  }],
});



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  app.dirname = __dirname;
  

  //var server = require('./server.js');
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      // The `plugins` have to be enabled.
      nodeIntegration: true,
      plugins: true,
    },
  });

  globalShortcut.register('f5', () => {
    mainWindow.reload();
  });

  globalShortcut.register('CommandOrControl+R', () => {
    mainWindow.reload();
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });

  const ses = mainWindow.webContents.session;

  // mainWindow = new BrowserWindow({width: 1600, height: 900})
  // and load the index.html of the app.

  //if (process.env.NODE_ENV == 'dev') {
    mainWindow.loadURL('http://localhost:3000');
  //} else {
  //  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //}

  // mainWindow.setFullScreen(true);


  mainWindow.focus();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
