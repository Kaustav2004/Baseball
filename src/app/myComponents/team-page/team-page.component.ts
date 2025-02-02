import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.css',
  imports: [CommonModule],
})
export class TeamPageComponent implements OnInit {
  playerId: string | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  playerData: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.playerId = this.route.snapshot.paramMap.get('playerId');
    if (this.playerId) {
      this.fetchPlayerData();
    }
  }

  fetchPlayerData(): void {
    const apiUrl = `https://statsapi.mlb.com/api/v1/people/${this.playerId}`;
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response.people && response.people.length > 0) {
          this.playerData = response.people[0];
        } else {
          this.errorMessage = 'No player data found.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load player data. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
