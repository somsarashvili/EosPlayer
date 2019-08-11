import { PlayableExtenstions } from './player.playable';
import * as log from 'electron-log';
import * as WebTorrentType from 'webtorrent';
import * as WebTorrent from 'webtorrent-hybrid';
import * as vlc from 'vlc-command';
import { EosCoreServices } from '../../eos.core.services';
import { EosShared } from '../../../eos.shared';
import { Server } from 'net';
import * as child_process from 'child_process';


export class PlayerService {
  private static instance: PlayerService;
  private webTorrent: WebTorrentType.Instance;
  private torrent: WebTorrentType.Torrent;
  private eventService: EosCoreServices.EventService;
  private server: Server;
  private vlc: child_process.ChildProcess;
  private playerData: EosShared.Models.PlayerModel;
  private constructor() {
    this.playerData = {
      playing: false,
      name: '',
      downloadProgress: 0,
      downloadSpeed: 0,
      peers: 0,
      imageUrl: null
    };
    this.webTorrent = new WebTorrent();
    this.eventService = EosCoreServices.EventService.INSTANCE;
  }

  public static get INSTANCE() {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }

    return PlayerService.instance;
  }

  private generateTrandomPort() {
    const min = 1024, max = 65535;

    return Math.floor(Math.random() * (max - min)) + min;
  }

  getPlayerStatus() {
    return this.playerData;
  }

  async close() {
    if (this.torrent) {
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

  async playTorrent(playRequest: EosShared.Models.PlayTorrentRequest) {
    this.close();

    this.playerData = {
      name: playRequest.name,
      downloadSpeed: 0,
      peers: 0,
      downloadProgress: 0,
      playing: true,
      imageUrl: playRequest.imageUrl
    };

    return await new Promise((resolve, reject) => {
      const re = /(?:\.([^.]+))?$/;
      const port = this.generateTrandomPort();
      let fileIndex = 0;

      this.webTorrent.add(playRequest.torrent, { path: playRequest.savePath }, (torrentClient: any) => {
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
            console.log(cmd);
            this.vlc = child_process.execFile(cmd, ['--fullscreen', url], function (err, stdout) {
              if (err) return console.error(err);
              console.log(stdout);
            });
            this.vlc.once('close', () => {
              this.close();
              this.eventService.sendEvent(EosShared.EosEvent.PLAYER_CLOSED, true);
            });
          } else {
            child_process.exec(cmd + ' --version', function (err, stdout) {
              if (err) return console.error(err);
              console.log(stdout);
            });
          }
        });
        console.log('sending torrent');
        resolve(this.torrent);
      });
    });
  }

}
