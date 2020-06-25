import { app, BrowserWindow, Display, screen } from 'electron';
import { injectable } from 'inversify';
import * as url from 'url';
import * as path from 'path';
import { Constants } from '../../core/constants';

@injectable()
export class WindowManager {
  private mainWindow: BrowserWindow;
  private primaryDisplay: Display;

  constructor() {
    this.primaryDisplay = screen.getPrimaryDisplay();
  }

  get HasWindow(): boolean {
    return this.mainWindow != null;
  }

  public async CreateMainWindow() {
    if (this.mainWindow) {
      return;
    }
    const workAreaSize = this.primaryDisplay.workAreaSize;

    this.mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      frame: false,
      width: workAreaSize.width,
      height: workAreaSize.height,
      webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: true, // turn off remote
        preload: __dirname + '/preloader.js',
        webSecurity: false,
      },
      icon: Constants.WebPath + '/favicon.png',
    });
    this.mainWindow.hide();
    if (process.env.SERVE) {
      require('electron-reload')(__dirname, {
        electron: require(process.cwd() + '/node_modules/electron'),
      });
      this.mainWindow.loadURL('http://localhost:4200', {
        userAgent: Constants.UserAgent,
      });
    } else {
      this.mainWindow.loadURL(
        url.format({
          pathname: path.join(Constants.WEB_FOLDER, 'index.html'),
          protocol: Constants.PROTOCOL + ':',
          slashes: true,
        }),
        {
          userAgent: Constants.UserAgent,
        }
      );
    }

    if (process.env.SERVE) {
      this.mainWindow.webContents.openDevTools();
    }


    this.mainWindow.removeMenu();

    this.mainWindow.maximize();


    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      app.quit();
    });

    return new Promise((resolve) => {
      this.mainWindow.webContents.once('dom-ready', () => {
        resolve();
      });
    });
  }

  public async ShowMainWindow() {
    await this.CreateMainWindow();

    this.mainWindow.show();
    this.mainWindow.focus();
  }
}
