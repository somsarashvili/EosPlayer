import { EosShared } from '../../../eos.shared';
import { ipcMain } from 'electron';
import { EosIPCFunction } from '.';
import * as log from 'electron-log';

export abstract class EosIPCserviceAbstract implements EosShared.EosIPCHandler {
  abstract playTorrent(torrent: EosShared.Models.PlayTorrentRequest);
  abstract closePlayer();
  abstract getPlayerStatus();

  protected async ipcReceive(eventName: EosShared.EosIPC, func: EosIPCFunction) {
    ipcMain.on(eventName, async (event, callerId, args) => {
      try {
        const res = await func(args);
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
