import { Injectable } from '@angular/core';
import { EosShared } from '../../../eos/eos.shared';
import { ipcRenderer } from 'electron';
import { Torrent } from 'webtorrent';

abstract class EosIPCserviceAbstract implements EosShared.EosIPCHandler {
  protected callerId: string = Math.random().toString();
  abstract playTorrent(playTorrent: EosShared.Models.PlayTorrentRequest): Promise<EosShared.EosResult<Torrent>>;
  abstract getPlayerStatus(): Promise<EosShared.EosResult<EosShared.Models.PlayerModel>>;
  abstract closePlayer();

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
      ipcRenderer.once(
        `${EosShared.EosIPCResult(event)}/${this.callerId}`,
        (sender, result: T) => {
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

  async playTorrent(playTorrent: EosShared.Models.PlayTorrentRequest): Promise<EosShared.EosResult<Torrent>> {
    return await this.ipcSend<EosShared.EosResult<Torrent>>(
      EosShared.EosIPC.PLAY_TORRENT,
      playTorrent
    );
  }

  async getPlayerStatus(): Promise<EosShared.EosResult<EosShared.Models.PlayerModel>> {
    return await this.ipcSend<EosShared.EosResult<EosShared.Models.PlayerModel>>(
      EosShared.EosIPC.GET_PLAYER_STATUS
    );
  }

  async closePlayer() {
    return await this.ipcSend<void>(
      EosShared.EosIPC.CLOSE_PLAYER
    );
  }
}
