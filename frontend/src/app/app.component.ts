import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter, Routes } from '@angular/router';

// Import Components

import { HomeComponent } from './myComponents/home/home.component';
import { PlayersComponent } from './myComponents/all-player/all-player.component';
import { AllTeamsComponent } from './myComponents/all-teams/all-teams.component';
import { ScheduleComponent } from './myComponents/schedule/schedule.component';
import { ToastComponent } from '../../toast.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-players', component: PlayersComponent },
  { path: 'all-teams', component: AllTeamsComponent },
  { path: 'schedule', component: ScheduleComponent },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

}
