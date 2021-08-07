import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  showZoomRoute = false;
  showOmegleRoute = false;

  constructor(private commonSrv: CommonService) {}

  ngOnInit(): void {
    this.commonSrv.routerEmitter.subscribe((url) => {
      switch (url) {
        case '/home':
          this.showOmegleRoute = false;
          this.showZoomRoute = false;

          break;
        case '/omegle':
          this.showOmegleRoute = true;
          this.showZoomRoute = false;

          break;
        case '/zoom':
          this.showZoomRoute = true;
          this.showOmegleRoute = false;

          break;
        default:
      }
    });
  }
}
