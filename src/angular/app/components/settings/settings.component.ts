import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public savePath: string;

  constructor() { }

  ngOnInit() {
    this.savePath = localStorage.getItem('savePath');
  }

  pickSavePath() {
    const paths = this.showOpenDialog();
    if (paths != null) {
      this.savePath = paths[0];
      this.savePathChanged();
    }
  }

  savePathChanged() {
    localStorage.setItem('savePath', this.savePath);
  }

  showOpenDialog() {
    alert('not implemented');
    // return this.electronService.dialog.showOpenDialog({
    //   properties: ['openDirectory']
    // });
  }
}
