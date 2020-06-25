import { PlayerService } from './../services/player/player.service';
import { RouteController, RouteEndpoint } from '../infrastructure/controller-decorator';
import { IResult } from '../../shared/types/IResult';
import { PlayTorrentRequest } from '../../shared/types/PlayTorrentRequest';
import { injectable, inject } from 'inversify';
import { Torrent } from 'webtorrent';
import { PlayerModel } from '../../shared/types/PlayerModel';

@RouteController()
@injectable()
export class PlayerController {
  constructor(
    @inject(PlayerService) private playerService: PlayerService
  ) { }

  @RouteEndpoint('playTorrent')
  async playTorrent(playTorrent: PlayTorrentRequest): Promise<IResult<boolean>> {
    const result = await this.playerService.playTorrent(playTorrent);
    return { data: result };
  }

  @RouteEndpoint('getPlayerStatus')
  async getPlayerStatus(): Promise<IResult<PlayerModel>> {
    return { data: await this.playerService.getPlayerStatus() };
  }

  @RouteEndpoint('closePlayer')
  async close(): Promise<IResult<void>> {
    return { data: await this.playerService.close() };
  }
}