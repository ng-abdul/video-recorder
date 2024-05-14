import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JoinMeetingComponent } from './join-meeting/join-meeting.component';
import { join } from 'path';

export const routes: Routes = [
    {path:'satrt-meeting', component:JoinMeetingComponent},
    {path:'meeting', component:HomeComponent},
    {path:'', redirectTo:'satrt-meeting', pathMatch:'full'},
];
