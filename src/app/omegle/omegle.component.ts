import {
  Component,
  ElementRef,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { io } from 'socket.io-client';
import { clientMessageResponse } from '../app.component';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-omegle',
  templateUrl: './omegle.component.html',
  styleUrls: ['./omegle.component.css'],
})
export class OmegleComponent implements OnInit {
  constructor(
    private router: Router,
    private commonSrv: CommonService,
    private spinner: NgxSpinnerService,
    private matSnackBar: MatSnackBar
  ) {}

  socket;
  room;
  localPeerConnection;
  remoteMediaStream = new MediaStream();
  myOwnMessage = false;
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
  disableDisconnectCall: boolean = true;
  isConnected: boolean = false;

  ngOnInit(): void {
    this.commonSrv.routerEmitter.emit(this.router.url);
    this.setUpLocalVideo();
  }

  start() {
    this.initiateWebRtc();
    this.spinner.show('MainScreenSpinner');
    this.disableDisconnectCall = false;
    // this.socket = io('https://my-node-app-web-rtc.herokuapp.com', {
    //   path: '/omegle',
    // });
    this.socket = io('http://localhost:3000', {
      path: '/omegle',
    });
    this.socket.on('room', (room) => {
      this.room = room;
      let messageModel: clientMessageResponse = {
        room: room,
        message: 'USERS CONNECTED',
      };
      this.socket.emit('hello-message', messageModel);
    });

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
              this.spinner.hide('MainScreenSpinner');
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
          this.spinner.hide('MainScreenSpinner');
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

  setUpLocalVideo() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((localMediaStream) => {
        this.localVideoHtmlElement.nativeElement.srcObject = localMediaStream;
      });
  }

  closeVideoConnection() {
    this.localPeerConnection.close();
    this.disableDisconnectCall = true;
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
        this.disableDisconnectCall = true;
        this.isConnected = false;
        this.socket.emit('force-disconnect', '');
      }
    };
  }
}

