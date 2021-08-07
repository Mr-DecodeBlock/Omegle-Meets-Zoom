import { EventEmitter } from '@angular/core';

export class CommonService {
  routerEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
}
