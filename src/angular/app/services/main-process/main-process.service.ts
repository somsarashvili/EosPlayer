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
  private mainProcessAPI: MainProcessAPI;
  private callerId: string;

  constructor() {
    this.mainProcessAPI = window.MainProcessAPI;
    this.callerId = CommonFunctions.generateGuid();
    this.mainProcessAPI.send('event.subscribe', this.callerId);
  }

  on(event: string, callback: Function) {
    this.mainProcessAPI.on(`${event}/${this.callerId}`, (_, data) => {
      callback(data);
    });
  }

  once(event: string, callback: Function) {
    this.mainProcessAPI.once(`${event}/${this.callerId}`, (_, data) => {
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
    return this.mainProcessAPI.getWebTorrentHealthModule();
  }

  get defaultDownloadPath() {
    return this.mainProcessAPI.defaultDownloadPath;
  }

  public async showOpenDialog() {
    return await this.mainProcessAPI.showOpenDialog();
  }

  private async ipcSend<T extends IResult<any>>(event: string, payload?): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      this.mainProcessAPI.once(
        `${event}.result/${this.callerId}`,
        (_, result: T) => {
          resolve(result);
        }
      );
      this.mainProcessAPI.send(event, this.callerId, payload);
    });
  }
}