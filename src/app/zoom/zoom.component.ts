import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';

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
  spinnerLoad: boolean = false;

  ngOnInit(): void {
    this.commonSrv.routerEmitter.emit(this.router.url);
    if (this.router.url === '/zoom/meeting') {
      this.codeInput = false;
    }
  }

  ngOnDestroy() {
    this.socket?.emit('force-disconnect', '');
  }

  checkCode(code: string) {
    this.spinnerLoad = true;
    this.socket = this.commonSrv.localSocketIO();
    setTimeout(() => {
      //check if any room available on server with this roomId
      this.socket.emit('room-available', code);
      this.socket.on('room-available', (body) => {
        if (body === 'true') {
          this.spinnerLoad = false;
          this.codeInput = false;
          this.router.navigate(['/zoom/meeting', code]);
        } else {
          this.spinnerLoad = false;
          this.status = 'No Room Found';
        }
      });
    }, 3000);
  }
}
