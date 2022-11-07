import { injectable } from 'inversify';
import * as log from 'electron-log';
import { IIPCSender } from './IIPCSender';

@injectable()
export class EventService {
  private static instance: EventService;
  private subscribers: IIPCSender[] = [];

  constructor() { }

  subscribe(event, callerId, arg) {
    const subscriber = this.subscribers.filter((e) => e.id == event.sender.id)[0];
    if (!subscriber) {
      const sender: IIPCSender = {
        id: event.sender.id,
        callerId: callerId,
        sender: event.sender,
      };
      this.subscribers.push(sender);
    } else {
      subscriber.callerId = callerId;
    }
  }



  static get INSTANCE() {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }

    return EventService.instance;
  }

  sendEvent(name: string, data: any) {
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