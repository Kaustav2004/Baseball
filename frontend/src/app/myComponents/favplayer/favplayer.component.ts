import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favplayer',
  imports: [CommonModule],
  templateUrl: './favplayer.component.html',
  styleUrl: './favplayer.component.css',
})

export class FavplayerComponent implements OnInit {
  players: string | null = null;
  teamInfo: any[] = [];
  showAll: boolean = false; // Toggle state for "View All"

  async ngOnInit() {
    this.players = localStorage.getItem('players');
    if (this.players) {
      const playersArray = this.players.split(',');

      for (const player of playersArray) {
        console.log(player);
        try {
          const response = await fetch(`https://statsapi.mlb.com/api/v1/people/${player}`);
          const data = await response.json();
          this.teamInfo.push({
            playerId: player,
            playerName: data.people[0].fullName,
          });
        } catch (error) {
          console.error(`Failed to fetch data for team ID: ${player}`, error);
        }
      }
      console.log(this.teamInfo);
    }
  }

  // Toggle function for View All / Show Less
  toggleView() {
    this.showAll = !this.showAll;
  }
}
