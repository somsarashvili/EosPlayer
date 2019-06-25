import { Injectable } from '@angular/core';
import { EosShared } from '../../../eos/eos.shared';
import { ipcRenderer } from 'electron';
import { Torrent } from 'webtorrent';

abstract class EosIPCserviceAbstract implements EosShared.EosIPCHandler {
  protected callerId: string = Math.random().toString();
  abstract playTorrent(torrent: string);

  protected subscribe() {
    ipcRenderer.send(EosShared.EosSystemEvent.SUBSCRIBE, this.callerId);
  }

  on(event: EosShared.EosEvent, callback: Function) {
    ipcRenderer.on(`${event}/${this.callerId}`, (sender, data) => {
      callback(data);
    });
  }

  once(event: EosShared.EosEvent, callback: Function) {
    ipcRenderer.once(`${event}/${this.callerId}`, (sender, data) => {
      callback(data);
    });
  }

  protected async ipcSend<T>(event: EosShared.EosIPC, payload?) {
    return await new Promise<T>((resolve, reject) => {
      console.log(`waiting ${EosShared.EosIPCResult(event)}/${this.callerId}`);
      ipcRenderer.once(
        `${EosShared.EosIPCResult(event)}/${this.callerId}`,
        (sender, result: T) => {
          console.log(`received${EosShared.EosIPCResult(event)}/${this.callerId}`);
          resolve(result);
        }
      );
      ipcRenderer.send(event, this.callerId, payload);
    });
  }
}

@Injectable()
export class EosIpcService extends EosIPCserviceAbstract {
  private static instance: EosIpcService;
  private constructor() {
    super();
    this.subscribe();
  }

  public static get INSTANCE() {
    if (!EosIpcService.instance) {
      EosIpcService.instance = new EosIpcService();
    }
    return EosIpcService.instance;
  }

  async playTorrent(torrent: string) {
    return await this.ipcSend<Torrent>(
      EosShared.EosIPC.PLAY_TORRENT,
      torrent
    );
  }
}
