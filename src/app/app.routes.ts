import { Routes } from '@angular/router';
import { HomeComponent } from './myComponents/home/home.component';
import { SignupComponent } from './myComponents/signup/signup.component';
import { TeamPageComponent } from './myComponents/team-page/team-page.component';
import { MatchComponent } from './myComponents/match/match.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: SignupComponent },
  { path: 'team-page/:playerId', component: TeamPageComponent },
  { path: 'match/:matchId', component: MatchComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
