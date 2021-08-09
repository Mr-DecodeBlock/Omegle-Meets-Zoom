import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css'],
})
export class ZoomComponent implements OnInit, OnDestroy {
  socket;
  status: string;
  codeInput: boolean = true;
  constructor(private router: Router, private commonSrv: CommonService) {}

  ngOnInit(): void {

    console.log(this.router.url);
    this.commonSrv.routerEmitter.emit(this.router.url);
  }

  ngOnDestroy() {
    this.socket?.emit('force-disconnect','')
  }

  checkCode(code: string) {
    this.status='Please Wait..'

    // this.socket = io('http://localhost:3000', {
    //   path: '/zoom',
    // });
    this.socket = io('https://my-node-app-web-rtc.herokuapp.com', {
      path: '/zoom',
    });
    //check if any room available on server with this roomId
    this.socket.emit('room-available', code);
    this.socket.on('room-available', (body) => {
      if (body === 'true') {
        //redirect to zoom-meeting
        console.log('success,now redirecting.....');
        this.codeInput = false;
        this.router.navigate(['/zoom/meeting', code]);
      } else {
        this.status = 'No Room Found'
      }
    });
  }
}
