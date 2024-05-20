import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
  public currentPage: string = '';
  public availableCameras: MediaDeviceInfo[] = [];
  public selectedCamera: MediaDeviceInfo | null = null;
  public mediaStream!: MediaStream;
  public videoOptions: MediaTrackConstraints = {};
  public isFrontCameraActive: boolean = true;
  public startTime: number = 0;
  public timerInterval: any;
  public timerValue: string = "00:00";
  public mediaRecorder: any;
  public buttonStart!: HTMLButtonElement;
  public buttonStop!: HTMLButtonElement;
  public videoLive!: HTMLVideoElement;
  public videoRecorded!: HTMLVideoElement;

  constructor() { }


  ngAfterViewInit(): void {
    this.queryDomElements();
    this.main();
  }

  queryDomElements(): void {
    this.buttonStart = document.querySelector<HTMLButtonElement>('#startRecording')!;
    this.buttonStop = document.querySelector<HTMLButtonElement>('#stopRecording')!;
    this.videoLive = document.querySelector<HTMLVideoElement>('#videoLive')!;
    this.videoRecorded = document.querySelector<HTMLVideoElement>('#videoRecorded')!;
  }

  downloadVideo() {
    const videoSrc = this.videoRecorded.src;
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = 'video.mp4';
    a.click();
  }

  async toggleCamera() {
    const videoElement: HTMLVideoElement = this.videoLive;
    const constraints = {
      video: {
        facingMode: this.isFrontCameraActive ? 'user' : 'environment'
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      this.isFrontCameraActive = !this.isFrontCameraActive;
    } catch (err) {
    }
  }

  main = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.mediaStream = stream;
      this.videoLive.srcObject = stream;

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      this.mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.videoRecorded.src = URL.createObjectURL(event.data);
          this.videoRecorded.style.display = 'inline-block';
        }
      });

      this.buttonStart.addEventListener('click', () => this.startVideo());
      this.buttonStop.addEventListener('click', () => this.stopVideo());
    } catch (err) {
    }
  }

  startVideo() {
    this.mediaRecorder!.start();
    this.startTimer();
    this.buttonStart.style.display = 'none';
    this.buttonStop.style.display = 'inline-block';
    this.videoRecorded.style.display = 'none';

    setTimeout(() => {
      // if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.stopTimer();
      this.buttonStart.style.display = 'inline-block';
      this.buttonStop.style.display = 'none';
      this.videoRecorded.style.display = 'inline-block';

      const stopRecordingButton = document.getElementById('stopRecording');
      stopRecordingButton!.click();
      // }
    }, 10000);
  }

  stopVideo() {
    // if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
    this.mediaRecorder.stop();
    this.stopTimer();
    this.buttonStart.style.display = 'inline-block';
    this.buttonStop.style.display = 'none';
    this.videoRecorded.style.display = 'inline-block';
    // }
  }

  public startTimer(): void {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.timerValue = this.formatTime(elapsedTime);
    }, 1000);
  }

  public stopTimer(): void {
    console.log('Stopping timer...');
    clearInterval(this.timerInterval);
    const elapsedTime = Date.now() - this.startTime;
    this.timerValue = this.formatTime(elapsedTime);
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
