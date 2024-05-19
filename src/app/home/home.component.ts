import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal!: ElementRef;
  public currentPage: string = '';
  public availableCameras: MediaDeviceInfo[] = [];
  public selectedCamera: MediaDeviceInfo | null = null;
  public mediaStream!: MediaStream;
  public videoOptions: MediaTrackConstraints = {};
  public isFrontCameraActive: boolean = true;
  public startTime: number = 0;
  public timerInterval: any;
  public timerValue: string = "00:00";
  public mediaRecorder: MediaRecorder | undefined;
  private buttonStart!: HTMLButtonElement;
  private buttonStop!: HTMLButtonElement;
  private videoLive!: HTMLVideoElement;
  private videoRecorded!: HTMLVideoElement;
  // private downloadRecordedVideobtn!: HTMLButtonElement;

  constructor() { }

  ngOnInit(): void {
    this.queryDomElements();
    this.main();
  }

  queryDomElements(): void {
    this.buttonStart = document.querySelector<HTMLButtonElement>('#startRecording')!;
    this.buttonStop = document.querySelector<HTMLButtonElement>('#stopRecording')!;
    this.videoLive = document.querySelector<HTMLVideoElement>('#videoLive')!;
    this.videoRecorded = document.querySelector<HTMLVideoElement>('#videoRecorded')!;
    // this.downloadRecordedVideobtn = document.querySelector<HTMLButtonElement>('.DownloadRecordedVideo')!;
  }

  downloadVideo() {
    const videoSrc = this.videoRecorded.src;
    const a = document.createElement('a');
    a.href = videoSrc;
    console.log('click');
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
      console.error('Error accessing camera:', err);
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

      if (!MediaRecorder.isTypeSupported('video/webm')) {
        console.warn('video/webm is not supported');
      }

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
      console.error('Error accessing media devices:', err);
    }
  }

  startVideo() {
    
    console.log('Starting video recording');
    this.mediaRecorder!.start();
    this.startTimer();
    this.buttonStart.style.display = 'none';
    this.buttonStop.style.display = 'inline-block';
    this.videoRecorded.style.display = 'none';
    // this.downloadRecordedVideobtn.style.display = 'none';

    setTimeout(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        console.log('Stopping video recording after 10 seconds');
        this.mediaRecorder.stop();
        this.stopTimer();
        this.buttonStart.style.display = 'inline-block';
        this.buttonStop.style.display = 'none';
        this.videoRecorded.style.display = 'inline-block';
        // this.downloadRecordedVideobtn.style.display = 'inline-block';
      }
    }, 10000); // Stop recording after 10 seconds
  }

  stopVideo() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      console.log('Stopping video recording manually');
      this.mediaRecorder.stop();
      this.stopTimer();
      this.buttonStart.style.display = 'inline-block';
      this.buttonStop.style.display = 'none';
      this.videoRecorded.style.display = 'inline-block';
      // this.downloadRecordedVideobtn.style.display = 'inline-block';
    }
  }


  public startTimer(): void {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.timerValue = this.formatTime(elapsedTime);
    }, 1000);
  }

  public stopTimer(): void {
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
  openModal() {
    const modalElement = this.exampleModal.nativeElement;

  }
}
