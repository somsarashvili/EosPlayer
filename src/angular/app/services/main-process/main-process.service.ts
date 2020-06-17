import { IResult } from './../../../../shared/types/IResult';
import { Injectable } from '@angular/core';
import { MainProcessAPI } from './MainProcessAPI';
import { CommonFunctions } from '../../../../shared/CommonFunctions';
import { Torrent } from 'webtorrent';
import { EosIPC } from '../../../../shared/enums/eos.ipc';
import { PlayTorrentRequest } from '../../../../shared/types/PlayTorrentRequest';
import { PlayerModel } from '../../../../shared/types/PlayerModel';

@Injectable()
export class MainProcessService {
  private ipcRenderer: MainProcessAPI;
  private callerId: string;

  constructor() {
    this.ipcRenderer = window.MainProcessAPI;
    this.callerId = CommonFunctions.generateGuid();
    this.ipcRenderer.send('event.subscribe', this.callerId);
  }

  on(event: string, callback: Function) {
    this.ipcRenderer.on(`${event}/${this.callerId}`, (_, data) => {
      callback(data);
    });
  }

  once(event: string, callback: Function) {
    this.ipcRenderer.once(`${event}/${this.callerId}`, (_, data) => {
      callback(data);
    });
  }

  async playTorrent(playTorrent: PlayTorrentRequest) {
    return await this.ipcSend<IResult<Torrent>>(EosIPC.PLAY_TORRENT, playTorrent);
  }

  async getPlayerStatus() {
    return await this.ipcSend<IResult<PlayerModel>>(
      EosIPC.GET_PLAYER_STATUS
    );
  }

  async close() {
    return await this.ipcSend<IResult<void>>(
      EosIPC.CLOSE_PLAYER
    );
  }

  getWebTorrentHealthModule() {
    return this.ipcRenderer.getWebTorrentHealthModule();
  }


  private async ipcSend<T extends IResult<any>>(event: string, payload?): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      this.ipcRenderer.once(
        `${event}.result/${this.callerId}`,
        (_, result: T) => {
          resolve(result);
        }
      );
      this.ipcRenderer.send(event, this.callerId, payload);
    });
  }
}