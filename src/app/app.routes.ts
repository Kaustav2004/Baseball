import { Routes } from '@angular/router';
import { HomeComponent } from './myComponents/home/home.component';
import { SignupComponent } from './myComponents/signup/signup.component';
import { TeamPageComponent } from './myComponents/team-page/team-page.component';
import { MatchComponent } from './myComponents/match/match.component';
import { TeamComponent } from './myComponents/team/team.component';
import { ScheduleComponent } from './myComponents/schedule/schedule.component';
import { ChooseTeamComponent } from './myComponents/choose-team/choose-team.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: SignupComponent },
  { path: 'team-page/:playerId', component: TeamPageComponent },  // Keeping playerId for dynamic routing
  { path: 'team/:teamId', component: TeamComponent },             // Dynamic teamId
  { path: 'match/:matchId', component: MatchComponent },          // Dynamic matchId
  { path: 'schedule', component: ScheduleComponent },
  { path: 'choose-team', component: ChooseTeamComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }               // Fallback route
];
