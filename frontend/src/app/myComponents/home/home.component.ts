import { Component, OnInit } from '@angular/core';
import { FeedComponent } from '../../myComponents/feed/feed.component';
import { LiveScoreComponent } from '../../myComponents/live-score/live-score.component';
import { FavplayerComponent } from '../../myComponents/favplayer/favplayer.component';
import { FavteamComponent } from '../../myComponents/favteam/favteam.component';
import { ProfileComponent } from '../../myComponents/profile/profile.component';
import { TrendingComponent } from '../../myComponents/trending/trending.component';
import { SearchComponent } from '../../myComponents/search/search.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    FeedComponent,
    LiveScoreComponent,
    FavplayerComponent,
    FavteamComponent,
    ProfileComponent,
    TrendingComponent,
    SearchComponent,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/auth']);
    }
  }
}
