import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-meeting',
  standalone: true,
  imports: [],
  templateUrl: './join-meeting.component.html',
  styleUrl: './join-meeting.component.css'
})
export class JoinMeetingComponent {
  constructor(public router: Router) {

  }
  gotoMeeting() {
    this.router.navigate(['/meeting']);
  }
}
