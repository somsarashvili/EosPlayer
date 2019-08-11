import { autoUpdater } from 'electron-updater';

export class UpdaterService {
  private static instance: UpdaterService;
  private constructor() {
    setInterval(() => {
      this.checkUpdates();
    }, 1800000);
    this.checkUpdates();
  }

  public static get INSTANCE() {
    if (!UpdaterService.instance) {
      UpdaterService.instance = new UpdaterService();
    }

    return UpdaterService.instance;
  }

  public checkUpdates() {
    console.log('checking-updates');
    autoUpdater.checkForUpdatesAndNotify().catch(e => {
      console.error(e);
    });
  }
}
