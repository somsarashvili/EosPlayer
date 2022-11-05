import * as path from 'path';
const webPath = path.join(__dirname, '..', 'web');

export class Constants {
  static readonly WEB_FOLDER = path.resolve(__dirname, '..', 'web');
  static readonly PROTOCOL = 'file';
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
