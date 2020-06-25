require('v8-compile-cache');
require('reflect-metadata');
const appStartTime = new Date().getTime();
export { appStartTime };

import * as log from 'electron-log';
import { app } from 'electron';
import { ElectronApp } from './infrastructure/electron-app';

Object.assign(console, log.functions);
process.env.APP_TYPE = 'electron';


const args = process.argv.slice(1);

if (args.some((val) => val === '--serve')) {
  process.env.SERVE = 'true';
} else {
  delete process.env.SERVE;
}

(async () => {
  await app.whenReady();
  await new ElectronApp().Start();
})();