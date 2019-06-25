import { EosIpcService } from './eos.ipc.service';
import { EosShared } from '../../../eos/eos.shared';

export class PlayerService {
  private ipc: EosIpcService;
  private static instance: PlayerService;

  private constructor() {
    this.ipc = EosIpcService.INSTANCE;
  }

  public static get INSTANCE() {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  async playTorrent(playTorrent: EosShared.Models.PlayTorrentRequest) {
    return await this.ipc.playTorrent(playTorrent);
  }

  async getPlayerStatus() {
    return await this.ipc.getPlayerStatus();
  }

  async close() {
    return await this.ipc.closePlayer();
  }
}
