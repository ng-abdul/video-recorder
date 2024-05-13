import { Component, OnInit } from '@angular/core';
import { WebcamInitError, WebcamModule, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WebcamModule, CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public showWebcam: boolean = false;
  public timerValue: string = '00:00';
  private timerInterval: any;
  private startTime: any;
  public availableCameras: MediaDeviceInfo[] = [];
  public selectedCamera: MediaDeviceInfo | null = null;
public videoRef:any;
  constructor() {
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
    this.videoRef = document.getElementById('video')
    console.log('video', this.videoRef);
    
    
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
    if (this.showWebcam) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }


  public switchCamera(event: any): void {
    const deviceId = event.target.value;
    const selectedCamera = this.availableCameras.find(camera => camera.deviceId === deviceId);
    if (selectedCamera) {
      this.selectedCamera = selectedCamera;
    }
  }
  

  private startTimer(): void {
    const storedStartTime = localStorage.getItem('timerStartTime');
    if (!storedStartTime) {
      this.startTime = Date.now();
      localStorage.setItem('timerStartTime', this.startTime.toString());
    } else {
      this.startTime = parseInt(storedStartTime, 10);
    }

    this.timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.timerValue = this.formatTime(elapsedTime);
    }, 1000);
  }

  private stopTimer(): void {
    clearInterval(this.timerInterval);
    const startTimeString = localStorage.getItem('timerStartTime');
    if (startTimeString) {
      const startTime = parseInt(startTimeString, 10);
      const elapsedTime = Date.now() - startTime;
      this.timerValue = this.formatTime(elapsedTime);
      localStorage.removeItem('timerStartTime');
    }
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
