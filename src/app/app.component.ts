import {Component, OnInit} from '@angular/core';
import {io, Socket} from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  socket;
  serverMessage;
  constructor() {
  }

  ngOnInit() {
    console.log('connecting with server....')

   // this.socket = io(' https://my-node-app-web-rtc.herokuapp.com')
    this.socket = io(' http://localhost:3000')


    this.socket.on('anyone', (msg)=> {

      this.serverMessage = msg
    })
  }

  title = 'Omegle-Meets-Zoom';
}
