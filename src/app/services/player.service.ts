import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { EosIpcService } from './eos.ipc.service';
import * as WebTorrent from 'webtorrent';
import { EosShared } from '../../../eos/eos.shared';

@Injectable()
export class PlayerService {
  private ipc: EosIpcService;
  torrentProcess: EosShared.Models.TorrentProgress;
  downloaded = false;
  playing: boolean;

  constructor(private electron: ElectronService) {
    this.ipc = EosIpcService.INSTANCE;
    this.ipc.on(EosShared.EosEvent.TORRENT_DOWNLOADING, (data: EosShared.Models.TorrentProgress) => {
      console.log(data);
      this.torrentProcess = data;
    });
    this.ipc.on(EosShared.EosEvent.TORRENT_DOWNLOADED, (data) => {
      console.log(data);
      this.downloaded = data;
    });
  }

  onClosed(func: Function) {
    this.ipc.on(EosShared.EosEvent.PLAYER_CLOSED, func);
  }

  onceClosed(func: Function) {
    this.ipc.once(EosShared.EosEvent.PLAYER_CLOSED, func);
  }

  async playTorrent(torrent: string) {
    this.playing = true;
    this.downloaded = false;
    this.torrentProcess = {
      downloadSpeed: 0,
      peers: 0
    };
    return await this.ipc.playTorrent(torrent);
  }

}
