import { EventEmitter } from '@angular/core';
import { io } from 'socket.io-client';

export class CommonService {
  routerEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  localSocketIO() {
    return io('http://localhost:3000', {
      path: '/zoom',
    });
  }

  globalSocketIO() {
    return io('https://my-node-app-web-rtc.herokuapp.com', {
      path: '/zoom',
    });
  }
}

export type clientMessageResponse = {
  room: string;
  message: string;
  info?: string;
};

export let iceConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun2.l.google.com:19305'],
    },
  ],
};
