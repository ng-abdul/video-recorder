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
  }

  downloadVideo() {
    var video: any = document.getElementById('videoRecorded');
    var videoSrc = video.src;
    var a = document.createElement('a');
    a.href = videoSrc;
    console.log('click');
    
    a.download = 'video.mp4';
    a.click();
  }

   async toggleCamera() {
    const videoElement: any = document.getElementById('videoLive');
    const constraints = {
      video: {
        facingMode: 'environment'
      }
    };
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
    } catch(err) {
      console.error('Error accessing camera:', err);
    }
  }
  
  getActiveCamera() {
    const videoElement: any = document.getElementById('videoLive');
    const videoTracks = (videoElement.srcObject ? videoElement.srcObject.getVideoTracks() : []);
    if (videoTracks.length > 0) {
      const track = videoTracks[0];
      const facingMode = track.getSettings().facingMode;
      return facingMode;
    }
    return null;
  }
 
  // takeSnapShot() {
  //   this.trigger.next()
  // }
  // toggleCamera(directionOrDeviceId: boolean | string) {
  //   this.nextWebcam.next(directionOrDeviceId)
  // }
  // get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable()
  // }
  // get nextWebcamObservable(): Observable<boolean | string> {
  //   return this.nextWebcam.asObservable()
  // }
  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }




  main = async () => {
    const buttonStart = document.querySelector<HTMLButtonElement>('#startRecording')
    const buttonStop = document.querySelector<HTMLButtonElement>('#stopRecording')
    const videoLive = document.querySelector<HTMLVideoElement>('#videoLive')
    const videoRecorded = document.querySelector<HTMLVideoElement>('#videoRecorded')
    const DownloadRecordedVideobtn = document.querySelector<HTMLVideoElement>('.DownloadRecordedVideo')
    const flipBtn = document.querySelector('#flip-btn');

  
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

    // flipBtn!.addEventListener('click', () =>{
    //   if( stream == null ) return
    //   stream.getTracks().forEach(t => {
    //     t.stop();
    //   });
    //   this.isFrontCameraActive = !this.isFrontCameraActive;  
    //       capture();
    // })
  
  
    if (buttonStart ) {
      buttonStart.addEventListener('click', () => {
        mediaRecorder.start();
        buttonStart.style.display = 'none';
        buttonStop!.style.display = 'inline-block'; 
        videoRecorded!.style.display = 'none'; 
        DownloadRecordedVideobtn!.style.display = 'none'; 
      });
      console.log("click");
      
  
     setTimeout(() => {
      mediaRecorder.stop();
      buttonStart.style.display = 'inline-block'; 
      buttonStop!.style.display = 'none'; 
      videoRecorded!.style.display = 'inline-block'; 
      DownloadRecordedVideobtn!.style.display = 'inline-block'; 
     }, 10000);
       
    }
    if(buttonStop){
      buttonStop.addEventListener('click', ()=>{
        mediaRecorder.stop();
        buttonStart!.style.display = 'inline-block';
        buttonStop.style.display = 'none';
        videoRecorded!.style.display = 'inline-block'; 
        DownloadRecordedVideobtn!.style.display = 'inline-block'; 
      })
    }
  
    if (videoRecorded) {
      mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data) {
          videoRecorded.src = URL.createObjectURL(event.data);
          videoRecorded.style.display = 'inline-block'; 
          // DownloadRecordedVideobtn!.style.display = 'inline-block'; 
        }
      });
    }
  }


}

