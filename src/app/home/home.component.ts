import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WebcamInitError, WebcamModule, WebcamImage, WebcamUtil, WebcamComponent } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { log } from 'node:console';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WebcamModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  public currentPage: string = ''
  public showWebcam: boolean = true;
  public availableCameras: MediaDeviceInfo[] = [];
  public selectedCamera: MediaDeviceInfo | null = null;
  public mediaStream!: MediaStream;
  public videoOptions: MediaTrackConstraints = {};
  public isFrontCameraActive: boolean = true;
  private trigger: Subject<void> = new Subject<void>()
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>()
  @ViewChild(WebcamComponent) webcamComponent!: WebcamComponent;
  constructor(public router:Router) {
    if (typeof navigator !== 'undefined') {
      WebcamUtil.getAvailableVideoInputs()
        .then((mediaDevices: MediaDeviceInfo[]) => {
          this.availableCameras = mediaDevices;
          this.selectedCamera = this.availableCameras[0];
        })
        .catch((err) => {
          console.error('Error getting available video inputs: ', err);
        });
    }
  }

  ngOnInit(): void {
    this.main();
    // this.toggleWebcam();
    if (this.router.url.includes('forgot-password')) {
      this.currentPage = 'forgot-password'
    }

  }
 
  takeSnapShot() {
    this.trigger.next()
  }
  toggleCamera(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId)
  }
  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable()
  }
  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable()
  }
  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  // public toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  //   const startButton = document.getElementById('startRecording') as HTMLButtonElement;
  //   const stopButton = document.getElementById('stopRecording') as HTMLButtonElement;

  //   if (this.showWebcam) {
  //     startButton.removeAttribute('disabled');
  //     stopButton.setAttribute('disabled', '');
  //   } else {
  //     startButton.setAttribute('disabled', '');
  //     stopButton.setAttribute('disabled', '');
  //   }

  // }


  main = async () => {
    const buttonStart = document.querySelector<HTMLButtonElement>('#startRecording')
    const buttonStop = document.querySelector<HTMLButtonElement>('#stopRecording')
    const videoLive = document.querySelector<HTMLVideoElement>('#videoLive')
    const videoRecorded = document.querySelector<HTMLVideoElement>('#videoRecorded')
  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
  
    if (videoLive) {
      videoLive.srcObject = stream
    }
  
    if (!MediaRecorder.isTypeSupported('video/webm')) {
      console.warn('video/webm is not supported')
    }
  
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    })
  
    if (buttonStart ) {
      buttonStart.addEventListener('click', () => {
        mediaRecorder.start();
        buttonStart.style.display = 'none';
        buttonStop!.style.display = 'inline-block'; 
        videoRecorded!.style.display = 'none'; 
      });
      console.log("click");
      
  
     setTimeout(() => {
      mediaRecorder.stop();
      buttonStart.style.display = 'inline-block'; 
      buttonStop!.style.display = 'none'; 
      videoRecorded!.style.display = 'block'; 
     }, 10000);
       
    }
    if(buttonStop){
      buttonStop.addEventListener('click', ()=>{
        mediaRecorder.stop();
        buttonStart!.style.display = 'inline-block';
        buttonStop.style.display = 'none';
        videoRecorded!.style.display = 'block'; 
      })
    }
  
    if (videoRecorded) {
      mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data) {
          videoRecorded.src = URL.createObjectURL(event.data);
          videoRecorded.style.display = 'block'; 
        }
      });
    }
  }
  
}
