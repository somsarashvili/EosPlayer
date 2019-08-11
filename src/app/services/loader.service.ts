import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class LoaderServicea {
  public loading$: EventEmitter<boolean>;
  private sender: any = '';

  constructor() {
    this.loading$ = new EventEmitter();
  }

  emitLoading(sender: any, isLoading: boolean): void {
    console.log(this.sender, sender, isLoading);
    if (!isLoading && sender != this.sender) { return; }
    this.loading$.emit(isLoading);
  }

  setSender(sender) {
    this.sender = sender;
  }
}
