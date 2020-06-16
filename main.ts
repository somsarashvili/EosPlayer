import { app, BrowserWindow, screen } from 'electron';
import { EosCoreServices} from './eos/core/eos.core.services';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';
import * as path from 'path';
import * as url from 'url';
const pjson = require('./package.json');

let win: BrowserWindow;
let serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
const eventService =  EosCoreServices.EventService.INSTANCE;
const playerService = EosCoreServices.PlayerService.INSTANCE;
const eosIpcService = EosCoreServices.EosIPCService.INSTANCE;
const eosUpdaterService = EosCoreServices.UpdaterService.INSTANCE;

log.transports.file.level = 'verbose';
log.transports.console.level = 'debug';
autoUpdater.logger = log;

process.on('uncaughtException', function (error) {
  // tslint:disable-next-line: no-console
  console.trace(error);
  log.error('uncaughtException', error, error.stack);
});
process.on('unhandledRejection', function (error) {
  // tslint:disable-next-line: no-console
  console.trace(error);
  log.error('unhandledRejection', error);
});

function createWindow() {
  process.env.APP_VER = pjson.version;
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    icon: path.join(__dirname, 'dist/favicon.png'),
    width: size.width,
    height: size.height,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    }, frame: false
  });

  // win.setMenu(null);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
  win.setMenu(null);

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {

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
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
