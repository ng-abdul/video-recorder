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

  it('should initialize with main function', () => {
    spyOn(component, 'main');
    component.ngOnInit();
    expect(component.main).toHaveBeenCalled();
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
