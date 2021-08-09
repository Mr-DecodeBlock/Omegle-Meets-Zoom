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

  constructor(private router: Router, private commonSrv: CommonService) {}

  socket;
  status: string;
  codeInput: boolean = true;

  ngOnInit(): void {
    this.commonSrv.routerEmitter.emit(this.router.url);
    if(this.router.url === '/zoom/meeting') {
      this.codeInput = false
    }
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
