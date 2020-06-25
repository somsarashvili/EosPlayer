import { EventService } from './../../../core/services/event/event.service';
import { injectable, inject } from 'inversify';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { IUpdaterService } from '../../../core/services/updater/updater.service';

@injectable()
export class ElectronUpdaterService implements IUpdaterService {
  private _updateCheckStarted = false;
  public updateAvailable = false;

  constructor(
    @inject(EventService) private eventService: EventService
  ) {
    const channel = process.env.APP_VER.split('-')[1];
    autoUpdater.autoDownload = false;
    autoUpdater.channel = channel ? channel : 'latest';
    autoUpdater.logger = log;

    setInterval(() => {
      this.checkUpdates();
    }, 1800000);
    this.checkUpdates();
  }

  async Run(): Promise<void> {
    autoUpdater.on('update-downloaded', () => {
      log.info('UPD: downloaded');
      this.updateAvailable = true;
      this._updateCheckStarted = false;
      this.eventService.sendEvent('event.updateDownloaded', true);
    });
    autoUpdater.on('checking-for-update', () => {
      this._updateCheckStarted = true;
      log.info('UPD: checking');
    });
    autoUpdater.on('update-available', () => {
      autoUpdater.downloadUpdate();
    });
    autoUpdater.on('update-not-available', () => {
      this._updateCheckStarted = false;
      log.info('UPD: not available');
    });
  }

  public checkUpdates() {
    autoUpdater.checkForUpdatesAndNotify().catch(e => {
      log.error(e);
    });

    return this.updateAvailable;
  }
}
