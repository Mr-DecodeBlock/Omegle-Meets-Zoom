import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css'],
})
export class ZoomComponent implements OnInit {
  constructor(private router: Router, private commonSrv: CommonService) {}

  ngOnInit(): void {
    console.log(this.router.url);
    this.commonSrv.routerEmitter.emit(this.router.url);
  }
}
