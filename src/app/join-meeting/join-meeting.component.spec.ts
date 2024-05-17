import { ComponentFixture, TestBed } from '@angular/core/testing';
import{RouterTestingModule} from'@angular/router/testing'
import { JoinMeetingComponent } from './join-meeting.component';
import { Router } from '@angular/router';
describe('JoinMeetingComponent', () => {
  let component: JoinMeetingComponent;
  let fixture: ComponentFixture<JoinMeetingComponent>;
let router: Router
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinMeetingComponent,RouterTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JoinMeetingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to /meeting when gotoMeeting is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.gotoMeeting();
    expect(navigateSpy).toHaveBeenCalledWith(['/meeting']);
  });
});
