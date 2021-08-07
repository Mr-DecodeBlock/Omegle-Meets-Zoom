import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private commonSrv: CommonService) {}

  ngOnInit(): void {
    console.log(this.router.url);
    this.commonSrv.routerEmitter.emit(this.router.url);
  }
}
