import { ipcMain } from 'electron';
import { EosShared } from '../../../eos.shared';
import * as log from 'electron-log';

export class EventService {
  private static instance: EventService;
  private subscribers: OdinIpcSender[] = [];

  private constructor() {
    ipcMain.on(EosShared.EosSystemEvent.SUBSCRIBE, (event, callerId, arg) => {
      console.log('subscribing');
      const subscriber = this.subscribers.filter(e => e.id === event.sender.id)[0];
      if (!subscriber) {
        const sender: OdinIpcSender = {
          id: event.sender.id,
          callerId: callerId,
          sender: event.sender
        };
        this.subscribers.push(sender);
      } else {
        subscriber.callerId = callerId;
      }
    });
  }

  static get INSTANCE() {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }

    return EventService.instance;
  }

  sendEvent(name: EosShared.EosEvent.PLAYER_URL, data: string);
  sendEvent(name: EosShared.EosEvent.TORRENT_DOWNLOADING, data: EosShared.Models.TorrentProgress);
  sendEvent(name: EosShared.EosEvent.TORRENT_DOWNLOADED | EosShared.EosEvent.PLAYER_CLOSED, data: boolean);
  sendEvent(name: EosShared.EosEvent, data: any) {
    log.info('sendEvent', name, data);
    log.info('subscribers', this.subscribers.length);

    this.subscribers.forEach(subscriber => {
      try {
        if (subscriber.callerId) {
          subscriber.sender.send(`${name}/${subscriber.callerId}`, data);
        } else {
          subscriber.sender.send(name, data);
        }
      } catch (err) {
        console.error('err', err);
        log.error(err);
        log.error(err.stack);
      }
    });
  }
}

interface OdinIpcSender {
  id: number;
  callerId: string;
  sender: any;
}
