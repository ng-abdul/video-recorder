import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mediaRecorderMock: jasmine.SpyObj<MediaRecorder>;
  let state: 'inactive' | 'recording' | 'paused';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.buttonStart = document.createElement('button');
    component.buttonStop = document.createElement('button');
    component.videoRecorded = document.createElement('video');

    mediaRecorderMock = jasmine.createSpyObj('MediaRecorder', ['start', 'stop']);

    state = 'inactive';
    Object.defineProperty(mediaRecorderMock, 'state', {
      get: () => 'inactive',
      configurable: true
    });

    component.mediaRecorder = mediaRecorderMock;
    spyOn(component, 'startTimer').and.callThrough();
    spyOn(component, 'stopTimer').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should start and stop video recording after 10 seconds', fakeAsync(() => {
    component.startVideo();

    expect(component.mediaRecorder!.start).toHaveBeenCalled();
    expect(component.startTimer).toHaveBeenCalled();
    expect(component.buttonStart.style.display).toBe('none');
    expect(component.buttonStop.style.display).toBe('inline-block');
    expect(component.videoRecorded.style.display).toBe('none');

    state = 'recording';
    tick(10000);
    tick(0);

    expect(component.mediaRecorder.stop).toHaveBeenCalled();
    expect(component.stopTimer).toHaveBeenCalled();
    expect(component.buttonStart.style.display).toBe('inline-block');
    expect(component.buttonStop.style.display).toBe('none');
    expect(component.videoRecorded.style.display).toBe('inline-block');
  }));


  it('should stop video recording ', fakeAsync(() => {
    component.stopVideo()

    state = 'inactive';
    expect(component.mediaRecorder!.stop).toHaveBeenCalled();
    expect(component.stopTimer).toHaveBeenCalled();
    expect(component.buttonStart.style.display).toBe('inline-block');
    expect(component.buttonStop.style.display).toBe('none');
    expect(component.videoRecorded.style.display).toBe('inline-block');

  }));

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

  it('should set up media stream and event listeners correctly in main function', async () => {
    const getUserMediaSpy = spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(new MediaStream()));

    await component.main();
    expect(getUserMediaSpy).toHaveBeenCalledWith({ video: true, audio: true });
    expect(component.videoLive.srcObject).toBeDefined();
    expect(component.mediaRecorder).toBeDefined();
    expect(component.mediaRecorder.mimeType).toBe('video/webm');
    expect(component.videoRecorded.src).toBeDefined();
    expect(component.videoRecorded.style.display).toBe('none');

    spyOn(component, 'startVideo');
    spyOn(component, 'stopVideo');

    const button = fixture.nativeElement.querySelector('button');
    button.click();

  });
});



