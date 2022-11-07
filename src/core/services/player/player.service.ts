import { EventService } from './../event/event.service';
import { PlayableExtenstions } from './player.playable';
import * as WebTorrent from 'webtorrent';
import * as vlc from 'vlc-command';
import { Server } from 'net';
import * as child_process from 'child_process';
import { PlayerModel } from '../../../shared/types/PlayerModel';
import { injectable, inject } from 'inversify';
import { PlayTorrentRequest } from '../../../shared/types/PlayTorrentRequest';

@injectable()
export class PlayerService {
  private webTorrent: WebTorrent.Instance;
  private torrent: WebTorrent.Torrent;
  private server: Server;
  private vlc: child_process.ChildProcess;
  private playerData: PlayerModel;
  private eventInterval?: NodeJS.Timer;

  constructor(
    @inject(EventService) private eventService: EventService
  ) {
    this.playerData = {
      playing: false,
      name: '',
      downloadProgress: 0,
      downloadSpeed: 0,
      peers: 0,
      imageUrl: null
    };
    this.webTorrent = new WebTorrent();
  }

  private generateTrandomPort() {
    const min = 1024, max = 65535;

    return Math.floor(Math.random() * (max - min)) + min;
  }

  getPlayerStatus() {
    return this.playerData;
  }

  async close() {
    clearInterval(this.eventInterval);
    if (this.torrent) {
      this.webTorrent.remove(this.torrent);
      this.torrent.removeAllListeners('download');
      this.torrent.destroy();
      this.torrent = null;
    }

    if (this.server) {
      this.server.close();
      this.server = null;
    }

    if (this.vlc) {
      this.vlc.kill();
    }

    this.playerData = {
      name: '',
      downloadSpeed: 0,
      peers: 0,
      downloadProgress: 0,
      playing: false,
      imageUrl: null
    };
  }

  async playTorrent(playRequest: PlayTorrentRequest) {
    this.close();

    this.playerData = {
      name: playRequest.name,
      downloadSpeed: 0,
      peers: 0,
      downloadProgress: 0,
      playing: true,
      imageUrl: playRequest.imageUrl
    };

    return await new Promise<boolean>((resolve, reject) => {
      const re = /(?:\.([^.]+))?$/;
      const port = this.generateTrandomPort();
      let fileIndex = 0;

      this.webTorrent.add(playRequest.torrent, { path: playRequest.savePath }, (torrentClient) => {
        this.torrent = torrentClient;
        this.torrent.deselect(0, torrentClient.pieces.length - 1, 0); // Remove default selection (whole torrent)
        // tslint:disable-next-line: forin
        for (let f in this.torrent.files) { // Add selection
          const file = this.torrent.files[f];
          if (PlayableExtenstions.includes(re.exec(file.name)[1])) {
            fileIndex = +f;
            file.select();
          } else {
            file.deselect();
          }
        }

        this.torrent.on('download', () => {
          this.playerData.peers = this.torrent.numPeers;
          this.playerData.downloadSpeed = this.torrent.downloadSpeed;
          this.playerData.downloadProgress = this.torrent.progress;
          this.playerData.playing = true;
        });

        this.server = this.torrent.createServer();
        this.server.listen(port);
        const url = 'http://127.0.0.1:' + port + '/' + fileIndex;

        vlc((err, cmd) => {
          if (err) { return console.error('could not find vlc command path'); }

          if (process.platform === 'win32') {
            this.vlc = child_process.execFile(cmd, ['--fullscreen', url], function (err, stdout) {
              if (err) return console.error(err);
            });
          } else {
            this.vlc = child_process.exec(cmd + ' --fullscreen ' + url, function (err, stdout) {
              if (err) return console.error(err);
            });
          }
          this.vlc.once('close', () => {
            this.close();
            this.eventService.sendEvent('event.playerClosed', true);
          });
        });
        resolve(true);
      });

      this.eventInterval = setInterval(() => {
        this.eventService.sendEvent('event.playerStatus', this.getPlayerStatus())
      }, 500);
    });
  }

}
