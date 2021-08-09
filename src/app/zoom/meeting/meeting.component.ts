import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  meetingId;
  socket;
  room;
  myOwnMessage;
  localPeerConnection;
  remoteMediaStream = new MediaStream();
  @ViewChild('localVideo', { static: true }) localVideoHtmlElement: ElementRef;
  @ViewChild('remoteVideo', { static: true })
  remoteVideoHtmlElement: ElementRef;
  iceConfiguration = {
    iceServers: [
      {
        urls: ['stun:stun3.l.google.com:19302'],
      },
    ],
  };

  ngOnInit(): void {
    this.socket = io('http://localhost:3000', {
      path: '/zoom',
    });
    // this.socket = io('https://my-node-app-web-rtc.herokuapp.com', {
    //   path: '/omegle',
    // });

    this.meetingId = this.route.snapshot.params.meetingId;
    if (this.meetingId) {
      console.log('joining rooom');
      //join otherwise set it.
      this.socket.emit('join-room', this.meetingId);
      this.socket.on('join-room', (flag) => {
        if (flag === 'true') {
          console.log('join room');
          this.initiateWebRtc();
        } else {
          this.router.navigate(['/zoom']);
        }
      });
    } else {
      console.log('setting rooom');

      this.socket.emit('create-room', '');

      this.socket.on('create-room', (room) => {
        this.room = room;
      });

      this.initiateWebRtc();
    }
  }

  initiateWebRtc() {
    this.localPeerConnection = new RTCPeerConnection(this.iceConfiguration);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((localMediaStream) => {
        this.localVideoHtmlElement.nativeElement.srcObject = localMediaStream;
        this.remoteVideoHtmlElement.nativeElement.srcObject =
          this.remoteMediaStream;
        this.localPeerConnection.addStream(localMediaStream);
      });
  }

  registerListener() {
    //this will run when we will get remote media stream after setup successfully
    console.log('running listener');
    this.localPeerConnection.ontrack = (event) => {
      console.log('adding track');
      this.remoteMediaStream = event.streams[0];
      this.remoteVideoHtmlElement.nativeElement.srcObject =
        this.remoteMediaStream;
    };

    //this will run when local set up desc is set,so ice candidate should be sent to others via signalling
    this.localPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        let messageModel = {
          room: this.room,
          message: event.candidate,
          info: '3',
        };
        this.socket.emit('send-message', messageModel);
        this.myOwnMessage = true;
      }
    };
  }
}
