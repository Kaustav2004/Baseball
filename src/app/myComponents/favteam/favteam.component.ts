import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favteam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favteam.component.html',
  styleUrl: './favteam.component.css',
})
export class FavteamComponent implements OnInit {
  teams: string | null = null;
  teamInfo: any[] = [];
  showAll: boolean = false; // Toggle state for "View All"

  async ngOnInit() {
    this.teams = localStorage.getItem('teams');
    if (this.teams) {
      const teamsArray = this.teams.split(',');

      for (const team of teamsArray) {
        try {
          const response = await fetch(`https://statsapi.mlb.com/api/v1/teams/${team}`);
          const data = await response.json();
          
          if (data.teams && data.teams.length > 0) {
            this.teamInfo.push({
              teamId: team,
              teamName: data.teams[0].name,
            });
          }
        } catch (error) {
          console.error(`Failed to fetch data for team ID: ${team}`, error);
        }
      }
    }
  }

  // Toggle function for View All / Show Less
  toggleView() {
    this.showAll = !this.showAll;
  }
}
