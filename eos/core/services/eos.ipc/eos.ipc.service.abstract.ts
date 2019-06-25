import { EosShared } from '../../../eos.shared';
import { ipcMain } from 'electron';
import { EosIPCFunction } from '.';
import * as log from 'electron-log';

export abstract class EosIPCserviceAbstract implements EosShared.EosIPCHandler {
  abstract playTorrent(torrent: string);

  protected async ipcReceive(eventName: EosShared.EosIPC, func: EosIPCFunction) {
    ipcMain.on(eventName, async (event, callerId, args) => {
      console.log('ipcReceive', eventName, callerId);
      try {
        const res = await func(args);
        console.log(`result: ${EosShared.EosIPCResult(eventName)}/${callerId}`);
        event.sender.send(`${EosShared.EosIPCResult(eventName)}/${callerId}`, res);
      } catch (err) {
        console.error('err', err);
        log.error(err);
        log.error(err.stack);
        const result: EosShared.EosResult<undefined> = { err: err };
        event.sender.send(`${EosShared.EosIPCResult(eventName)}/${callerId}`, result);
      }
    });
  }
}