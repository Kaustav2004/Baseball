import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

interface Player {
  id: number;
  fullName: string;
  headshotUrl: string;
}

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#0F1C2E] min-h-screen p-8">
      <div class="container mx-auto max-w-2xl">
        <!-- Most Followed Teams -->
        <h2 class="text-[#FFFFFF] text-2xl font-bold mb-4">
          Most Followed Teams
        </h2>
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div
            *ngFor="let team of mostFollowedTeams"
            class="bg-[#1f2b3e] rounded-lg p-3 flex flex-col items-center"
          >
            <div
              class="w-12 h-12 flex justify-center items-center bg-white rounded-full"
            >
              <img [src]="team.logoUrl" [alt]="team.name" class="w-10 h-10" />
            </div>
            <h3 class="text-[#FFFFFF] text-sm mt-2 text-center">
              {{ team.name }}
            </h3>
          </div>
        </div>

        <!-- Most Followed Players -->
        <h2 class="text-[#FFFFFF] text-2xl font-bold mb-4">
          Most Followed Players
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div
            *ngFor="let player of mostFollowedPlayers"
            class="bg-[#1f2b3e] rounded-lg p-3 flex flex-col items-center"
          >
            <img
              [src]="player.headshotUrl"
              [alt]="player.fullName"
              class="w-12 h-12 object-cover rounded-full"
            />
            <h3 class="text-[#FFFFFF] text-sm mt-2 text-center">
              {{ player.fullName }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TrendingComponent implements OnInit {
  mostFollowedTeamIds = [147, 119, 121, 135, 144];
  mostFollowedPlayerIds = [660271, 592450, 665742, 605141, 545361];

  mostFollowedTeams: Team[] = [];
  mostFollowedPlayers: Player[] = [];

  async ngOnInit() {
    await this.fetchMostFollowedTeams();
    await this.fetchMostFollowedPlayers();
  }

  private async fetchMostFollowedTeams() {
    const teamsUrl = 'https://statsapi.mlb.com/api/v1/teams?sportId=1';
    try {
      const response = await fetch(teamsUrl);
      const data = await response.json();

      this.mostFollowedTeams = this.mostFollowedTeamIds.map((teamId) => {
        const team = data.teams.find((t: Team) => t.id === teamId);
        return {
          id: team.id,
          name: team.name,
          logoUrl: `https://www.mlbstatic.com/team-logos/${teamId}.svg`,
        };
      });
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }

  private async fetchMostFollowedPlayers() {
    this.mostFollowedPlayers = await Promise.all(
      this.mostFollowedPlayerIds.map(async (playerId) => {
        try {
          const response = await fetch(
            `https://statsapi.mlb.com/api/v1/people/${playerId}`
          );
          const data = await response.json();
          const player = data.people[0];

          return {
            id: player.id,
            fullName: player.fullName,
            headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${playerId}.jpg`,
          };
        } catch (error) {
          console.error(`Error fetching player ${playerId}:`, error);
          return null;
        }
      })
    ).then((players) => players.filter((player) => player !== null));
  }
}
