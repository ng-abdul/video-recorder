import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  public currentPage: string = '';
  public availableCameras: MediaDeviceInfo[] = [];
  public selectedCamera: MediaDeviceInfo | null = null;
  public mediaStream!: MediaStream;
  public videoOptions: MediaTrackConstraints = {};
  public isFrontCameraActive: boolean = true;
  startTime: number = 0;
  timerInterval: any;
  timerValue: string = "00:00";

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.main();
  }

  downloadVideo() {
    const video: any = document.getElementById('videoRecorded');
    const videoSrc = video.src;
    const a = document.createElement('a');
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
    } catch (err) {
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

  // public handleInitError(error: WebcamInitError): void {
  //   if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
  //     console.warn("Camera access was not allowed by user!");
  //   }
  // }

  main = async () => {
    const buttonStart = document.querySelector<HTMLButtonElement>('#startRecording');
    const buttonStop = document.querySelector<HTMLButtonElement>('#stopRecording');
    const videoLive = document.querySelector<HTMLVideoElement>('#videoLive');
    const videoRecorded = document.querySelector<HTMLVideoElement>('#videoRecorded');
    const DownloadRecordedVideobtn = document.querySelector<HTMLVideoElement>('.DownloadRecordedVideo');
    const flipBtn = document.querySelector('#flip-btn');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoLive) {
      videoLive.srcObject = stream;
    }

    if (!MediaRecorder.isTypeSupported('video/webm')) {
      console.warn('video/webm is not supported');
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    });

    if (buttonStart) {
      buttonStart.addEventListener('click', () => {
        mediaRecorder.start();
        this.startTimer();  // Start the timer when recording starts
        buttonStart.style.display = 'none';
        buttonStop!.style.display = 'inline-block';
        videoRecorded!.style.display = 'none';
        DownloadRecordedVideobtn!.style.display = 'none';
      });

      setTimeout(() => {
        mediaRecorder.stop();
        this.stopTimer();  // Stop the timer when recording stops
        buttonStart.style.display = 'inline-block';
        buttonStop!.style.display = 'none';
        videoRecorded!.style.display = 'inline-block';
        DownloadRecordedVideobtn!.style.display = 'inline-block';
      }, 10000);

    }
    if (buttonStop) {
      buttonStop.addEventListener('click', () => {
        mediaRecorder.stop();
        this.stopTimer();  // Stop the timer when recording stops
        buttonStart!.style.display = 'inline-block';
        buttonStop.style.display = 'none';
        videoRecorded!.style.display = 'inline-block';
        DownloadRecordedVideobtn!.style.display = 'inline-block';
      });
    }

    if (videoRecorded) {
      mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data) {
          videoRecorded.src = URL.createObjectURL(event.data);
          videoRecorded.style.display = 'inline-block';
        }
      });
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
