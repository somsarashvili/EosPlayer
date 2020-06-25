import { MainProcessService } from './../../services/main-process/main-process.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public savePath: string;

  constructor(
    private readonly mainProcess: MainProcessService
  ) { }

  ngOnInit() {
    this.savePath = localStorage.getItem('savePath');
  }

  async pickSavePath() {
    const paths = await this.mainProcess.showOpenDialog();
    if (paths != null) {
      this.savePath = paths;
      this.savePathChanged();
    }
  }

  savePathChanged() {
    localStorage.setItem('savePath', this.savePath);
  }
}
