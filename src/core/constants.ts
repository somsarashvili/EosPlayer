import * as fs from 'fs';
import * as path from 'path';
let appPath, binPath, webPath;

if (process.platform === 'darwin') {
  if (fs.existsSync(path.join(process.cwd(), 'bin'))) {
    appPath = process.cwd();
  } else {
    appPath = '/Applications/Eos\ Player.app/Contents'; // TODO: fix pathts
  }
} else if (process.platform === 'linux') {
  if (fs.existsSync(path.join(process.cwd(), 'bin'))) {
    appPath = process.cwd();
  } else {
    appPath = path.join(__dirname, '/../../../..');
  }
} else {
  if (fs.existsSync(path.join(process.cwd(), 'bin'))) {
    appPath = process.cwd();
  } else {
    appPath = path.join(__dirname, '/../../../..');
  }
}
webPath = path.join(__dirname, '..', 'web');

export class Constants {
  static readonly WEB_FOLDER = path.resolve(__dirname, '..', 'web');
  static readonly PROTOCOL = 'file';
  static readonly AppPath = appPath;
  static readonly WebPath = webPath;
  static get AppVer() {
    return process.env.APP_VER;
  }
  static get UserAgent() {
    return process.env.USER_AGENT;
  }
  static get UserData() {
    return process.env.UserData;
  }
}
