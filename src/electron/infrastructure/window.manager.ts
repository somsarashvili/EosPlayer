import { app, BrowserWindow, Display, screen } from 'electron';
import { injectable } from 'inversify';
import * as url from 'url';
import * as path from 'path';
import { Constants } from '../../core/constants';
import * as remote from '@electron/remote/main';
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");


@injectable()
export class WindowManager {
  private mainWindow: BrowserWindow;
  private primaryDisplay: Display;

  constructor() {
    this.primaryDisplay = screen.getPrimaryDisplay();
    remote.initialize();
  }

  get HasWindow(): boolean {
    return this.mainWindow != null;
  }

  public async CreateMainWindow() {
    if (this.mainWindow) {
      return;
    }
    const workAreaSize = this.primaryDisplay.workAreaSize;
    // setupTitlebar();
    this.mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      frame: true,
      width: workAreaSize.width,
      height: workAreaSize.height,
      webPreferences: {
        nodeIntegration: true, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        preload: __dirname + '/preloader.js',
        webSecurity: false,
      },
      icon: Constants.WebPath + '/favicon.png',
    });
    remote.enable(this.mainWindow.webContents);
    //attachTitlebarToWindow(this.mainWindow);
    this.mainWindow.hide();
    this.mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
      },
    );
    this.mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          'Access-Control-Allow-Origin': ['*'],
          ...details.responseHeaders,
        },
      });
    });
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

    return new Promise<void>((resolve) => {
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

