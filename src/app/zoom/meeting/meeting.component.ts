import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import {clientMessageResponse} from "../../app.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router,
              private matSnackBar : MatSnackBar) {}
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
  isConnected = false;

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
          this.setUpLocalVideo();
          this.start();
          let messageModel: clientMessageResponse = {
            room: this.meetingId,
            message: 'USERS CONNECTED',
          };
          this.socket.emit('hello-message', messageModel);

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
      this.setUpLocalVideo();
      this.start();


    }
  }

  start() {
    console.log('already,start function fired.')
    this.initiateWebRtc();


    this.socket.on('hello-message', (body) => {
      if (body === 'USERS CONNECTED') {
        console.log('CONNECTED,NOW MAKING VIDEO CONNECTION');
        this.makeVideoConnection();
      }
    });

    //info :
    //1 -> user 2 is creating answer
    //2-> user 1 is accepting
    //3 -> setting ice candidates.

    this.socket.on('send-message', (body) => {
      if (!this.myOwnMessage) {
        //setting user 2 remote description from user1
        if (body?.info === '1') {
          console.log('setting offer for user 2 and creating answer');
          this.localPeerConnection
            .setRemoteDescription(new RTCSessionDescription(body.message))
            .then(() => {
              this.localPeerConnection.createAnswer().then((answer) => {
                this.localPeerConnection
                  .setLocalDescription(answer)
                  .then(() => {
                    let messageModel: clientMessageResponse = {
                      room: this.room,
                      message: answer,
                      info: '2',
                    };

                    this.socket.emit('send-message', messageModel);
                    this.myOwnMessage = true;
                  });
              });
              this.isConnected = true;
            });
        }

        //setting user 1 remote description from user2
        if (body?.info === '2') {
          console.log('setting answer for user 1');
          console.log(body.message);
          this.localPeerConnection.setRemoteDescription(
            new RTCSessionDescription(body.message)
          );
          this.isConnected = true;
        }

        if (body?.info === '3') {
          //it is ice candidate message indeed.
          if (body.message) {
            this.localPeerConnection.addIceCandidate(body.message);
            console.log('Ice candidate added.');
          }
        }
      } else {
        this.myOwnMessage = false;
      }
    });
  }

  makeVideoConnection() {
    console.log('setting local offer and sending');
    this.localPeerConnection.createOffer().then((offer) => {
      this.localPeerConnection.setLocalDescription(offer).then(() => {
        let messageModel: clientMessageResponse = {
          room: this.room,
          message: offer,
          info: '1',
        };

        this.socket.emit('send-message', messageModel);
        this.myOwnMessage = true;
      });
    });
  }

  initiateWebRtc() {
    this.localPeerConnection = new RTCPeerConnection(this.iceConfiguration);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((localMediaStream) => {
        this.remoteVideoHtmlElement.nativeElement.srcObject =
          this.remoteMediaStream;
        this.localPeerConnection.addStream(localMediaStream);
      });
    this.registerListener();
  }

  closeVideoConnection() {
    this.localPeerConnection.close();
    this.isConnected = false;
    this.socket.emit('force-disconnect', '');
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

    this.localPeerConnection.onconnectionstatechange = (event) => {
      if (this.localPeerConnection.connectionState === 'disconnected') {
        this.matSnackBar.open(
          'User has Disconnected. Press Find For New User',
          'X',
          {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 4000,
            panelClass: ['snackbar-class'],
          }
        );
        this.isConnected = false;
        this.socket.emit('force-disconnect', '');
      }
    };
  }

  setUpLocalVideo() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((localMediaStream) => {
        this.localVideoHtmlElement.nativeElement.srcObject = localMediaStream;
      });
  }


}
