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
    this.ipcReceive(EosShared.EosIPC.PLAY_TORRENT, async (torrent: string) => {
      const result =  await this.player.playTorrent(torrent);
      console.log('sending torretn1');
      return {
        result: result,
        err: false
      };
    });
  }
}
