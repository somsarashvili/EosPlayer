import { EventService } from './../../core/services/event/event.service';
import { App, app, ipcMain } from 'electron';
import log from 'electron-log';
import { WindowManager } from './window.manager';
import { EosDIContainer, EosDIControllerBinder } from '../../core/infrastructure/dependency-injection';
import { appStartTime } from '../main';
import { RegisterControllers, RegisterRoutes } from '../router';
import { BootCore } from '../../core/boot';
import { ElectronUpdaterService } from '../services/updater/updater.service';

export class ElectronApp {
  private app: App;
  private windowManager: WindowManager;

  constructor() {
    this.app = app;
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
    }

    process.env.APP_VER = this.app.getVersion();
    EosDIContainer.bind(WindowManager).toSelf().inSingletonScope();
    EosDIContainer.bind(ElectronUpdaterService).toSelf().inSingletonScope();

    this.windowManager = EosDIContainer.get(WindowManager);
  }

  public async Start(): Promise<void> {
    await BootCore()

    this.app.on('window-all-closed', () => {
      log.info('Exiting');
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
    });

    this.app.on('activate', async () => {
      if (!this.windowManager.HasWindow) {
        await this.windowManager.ShowMainWindow();
      }
    });

    RegisterControllers(EosDIControllerBinder);
    RegisterRoutes(EosDIContainer);

    ipcMain.on('event.subscribe', (event, callerId, arg) => {
      log.info('subscribing');
      EosDIContainer.get(EventService).subscribe(event, callerId, arg);
    });

    await this.windowManager.ShowMainWindow();
    await EosDIContainer.get(ElectronUpdaterService).Run();

    log.log('App Boot Time: ', (new Date().getTime() - appStartTime) / 1000);
  }
}