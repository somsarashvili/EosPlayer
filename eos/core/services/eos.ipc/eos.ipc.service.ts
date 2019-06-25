import { PlayerService } from './../player/player.service';
import { EosIPCserviceAbstract } from './eos.ipc.service.abstract';
import { EosShared } from '../../../eos.shared';

export class EosIPCService extends EosIPCserviceAbstract {
  private static instance: EosIPCService;
  private player: PlayerService;
  private constructor() {
    super();
    const _this = this;
    this.player = PlayerService.INSTANCE;
    for (const handler of Object.values(EosShared.EosIPC)) {
      _this[handler]();
    }
  }

  public static get INSTANCE() {
    if (!EosIPCService.instance) {
      EosIPCService.instance = new EosIPCService();
    }

    return EosIPCService.instance;
  }

  playTorrent() {
    this.ipcReceive(EosShared.EosIPC.PLAY_TORRENT, async (torrent: EosShared.Models.PlayTorrentRequest) => {
      const result = await this.player.playTorrent(torrent);
      return {
        result: result,
        err: false
      };
    });
  }

  closePlayer() {
    this.ipcReceive(EosShared.EosIPC.CLOSE_PLAYER, async (arg) => {
      const result = await this.player.close();
      return {
        result: result,
        err: false
      };
    });
  }

  getPlayerStatus() {
    this.ipcReceive(EosShared.EosIPC.GET_PLAYER_STATUS, async (arg) => {
      const result = await this.player.getPlayerStatus();
      return {
        result: result,
        err: false
      };
    });
  }
}
