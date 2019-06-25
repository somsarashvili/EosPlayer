import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { interval } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  downloaded = false;
  peers = 0;
  downloadSpeed = '';
  sub;
  id: number;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly player: PlayerService,
    private readonly router: Router) { }

  ngOnInit() {
    this.downloaded = false;
    this.sub = this.activeRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
    const refresh = interval(1000);
    const sub = refresh.subscribe(() => {
      this.downloadSpeed = window.Common.fileSize(this.player.torrentProcess.downloadSpeed);
      this.peers = this.player.torrentProcess.peers;
      this.downloaded = this.player.downloaded;
      if (this.downloaded) {
        sub.unsubscribe();
      }
    });

    this.player.onceClosed((e) => {
      this.router.navigate(['/movie', this.id]);
    });
  }

}
