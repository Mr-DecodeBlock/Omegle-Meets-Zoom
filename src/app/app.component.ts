import {Component, OnInit} from '@angular/core';
import {io} from "socket.io-client";


export type clientMessageResponse = {
  room : string,
  message : string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  socket;
  serverMessage;
  room;


  ngOnInit() {
    console.log('connecting with server....')

  // this.socket = io('https://my-node-app-web-rtc.herokuapp.com')
    this.socket = io('http://localhost:3000')

    this.socket.on('room',(room)=> {
      //if room is not set
      if(!!room) {
        this.room = room
        console.log('entered a room')
        console.log(room)
        let messageModel: clientMessageResponse ={
          room : room,
          message : 'Hello from the other side'
        }
        this.socket.emit('send-message', messageModel)
      }

    })

    this.socket.on('send-message',(msg)=> {
      console.log(msg)
    })

  }

  title = 'Omegle-Meets-Zoom';
}
