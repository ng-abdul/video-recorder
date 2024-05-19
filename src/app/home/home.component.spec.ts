import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should start recording when start button is clicked', async () => {
    const mediaRecorder = jasmine.createSpyObj('MediaRecorder', ['start', 'stop']);

    const mockButtonStart = document.createElement('button');
    mockButtonStart.id = 'startRecording';
    mockButtonStart.click();
    document.body.appendChild(mockButtonStart);
     expect(mediaRecorder.start)
    const mockButtonStop = document.createElement('button');
    mockButtonStop.id = 'stopRecording';
    document.body.appendChild(mockButtonStop);
  
    const mockVideoRecorded = document.createElement('video');
    mockVideoRecorded.id = 'videoRecorded';
    document.body.appendChild(mockVideoRecorded);
  
    const mockDownloadRecordedVideoBtn = document.createElement('button');
    mockDownloadRecordedVideoBtn.className = 'DownloadRecordedVideo';
    document.body.appendChild(mockDownloadRecordedVideoBtn);
  
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve({} as MediaStream));
    spyOn(window, 'MediaRecorder').and.returnValue(mediaRecorder);
  
    await component.main();
  
  
    expect(mediaRecorder.start).toHaveBeenCalled();
    expect(component.startTimer).toHaveBeenCalled();
    expect(mockButtonStart.style.display).toBe('none');
    expect(mockButtonStop.style.display).toBe('inline-block');
    expect(mockVideoRecorded.style.display).toBe('none');
    expect(mockDownloadRecordedVideoBtn.style.display).toBe('none');
  
    document.body.removeChild(mockButtonStart);
    document.body.removeChild(mockButtonStop);
    document.body.removeChild(mockVideoRecorded);
    document.body.removeChild(mockDownloadRecordedVideoBtn);
  });
  
  
  it('should toggle camera', async () => {
    const mockStream = new MediaStream();
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(mockStream));

    const videoElement = document.createElement('video');
    videoElement.id = 'videoLive';
    document.body.appendChild(videoElement);

    await component.toggleCamera();

    expect(component.isFrontCameraActive).toBe(false);
    expect((<HTMLVideoElement>document.getElementById('videoLive')).srcObject).toBe(mockStream);

    await component.toggleCamera();

    expect(component.isFrontCameraActive).toBe(true);
    document.body.removeChild(videoElement);
  });

  it('should download video', () => {
    const videoElement = document.createElement('video');
    videoElement.id = 'videoRecorded';
    videoElement.src = 'blob:http://example.com/video';
    document.body.appendChild(videoElement);

    spyOn(document, 'createElement').and.callThrough();

    component.downloadVideo();

    expect(document.createElement).toHaveBeenCalledWith('a');
    document.body.removeChild(videoElement);
  });

  it('should start and stop the timer', () => {
    jasmine.clock().install();
    component.startTimer();
    jasmine.clock().tick(3000);
    component.stopTimer();

    expect(component.timerValue).toBe('00:00');
    jasmine.clock().uninstall();
  });


});
