import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface Team {
  id: number;
  name: string;
}

interface Game {
  gameDate: string;
  venue: {
    name: string;
  };
  teams: {
    away: {
      team: Team;
    };
    home: {
      team: Team;
    };
  };
  status: {
    detailedState: string;
  };
  seriesDescription: string;
}

interface TeamWithGames {
  id: number;
  name: string;
  games: Game[];
  logoUrl: string;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatButtonToggleModule,
  ],
  template: `
    <div class="min-h-screen bg-[#0F1C2E] p-4 py-2">
      <div class="container mx-auto">
        <div *ngIf="isLoading" class="flex justify-center items-center h-64">
          <mat-spinner
            [strokeWidth]="4"
            [diameter]="50"
            class="accent-spinner"
          ></mat-spinner>
        </div>

        <div class="min-h-screen bg-[#0F1C2E] p-6">
          <div class="container mx-auto">
            <div
              *ngIf="isLoading"
              class="flex justify-center items-center h-64"
            >
              <mat-spinner
                [strokeWidth]="4"
                [diameter]="50"
                class="accent-spinner"
              ></mat-spinner>
            </div>

            <div *ngIf="!isLoading" class="overflow-hidden">
              <!-- Toggle Switch with updated classes -->
              <div class="flex justify-center mb-6">
                <mat-button-toggle-group
                  [value]="selectedView"
                  (change)="onViewChange($event)"
                  class="bg-[#1f2b3e] custom-toggle-group"
                >
                  <mat-button-toggle value="favorite" class="custom-toggle">
                    Your Teams
                  </mat-button-toggle>
                  <mat-button-toggle value="recommended" class="custom-toggle">
                    Recommended Teams
                  </mat-button-toggle>
                </mat-button-toggle-group>
              </div>

              <!-- Teams Section -->
              <div class="grid grid-cols-1 gap-2">
                <mat-card
                  *ngFor="let team of displayedTeams"
                  class="bg-[#1f2b3e] border-l-4 border-[#3D5A80]"
                >
                  <div class="p-4 bg-[#1f2b3e] rounded-xl">
                    <!-- Team Header -->
                    <div class="flex items-center gap-4 mb-4">
                      <div
                        class="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <img
                          [src]="team.logoUrl"
                          [alt]="team.name"
                          class="w-10 h-10 object-contain"
                          onerror="this.src='assets/default-team-logo.png'"
                        />
                      </div>
                      <h3 class="text-[#FFFFFF] text-xl font-semibold">
                        {{ team.name }}
                      </h3>
                    </div>

                    <!-- Upcoming Games - Modified container -->
                    <div class=" overflow-x-auto">
                      <!-- Simplified container -->
                      <div
                        class="flex gap-2 min-w-full pb-2 border-emerald-200"
                      >
                        <!-- Added min-w-full -->
                        <div
                          *ngIf="team.games.length === 0"
                          class="text-[#e0e0e0] w-full text-center"
                        >
                          No upcoming games scheduled
                        </div>

                        <div
                          *ngFor="let game of team.games"
                          class="bg-[#374357] rounded-lg p-4 w-1/2 flex-shrink-0"
                        >
                          <div class="flex justify-between items-center mb-2">
                            <span class="text-[#cee8ff] font-medium">
                              {{ game.teams.away.team.name }} &#64;
                              {{ game.teams.home.team.name }}
                            </span>
                          </div>
                          <div class="text-[#e0e0e0] text-sm space-y-1">
                            <p>{{ formatDate(game.gameDate) }}</p>
                            <p>{{ game.venue.name }}</p>
                            <p>{{ game.seriesDescription }}</p>
                            <!-- <span
                              class="inline-block px-2 py-1 bg-[#3D5A80] text-[#FFFFFF] text-xs rounded mt-2"
                            >
                              {{ game.status.detailedState }}
                            </span> -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep .accent-spinner circle {
        stroke: #3d5a80 !important;
      }

      ::ng-deep .mat-mdc-card {
        --mdc-elevated-card-container-color: transparent;
      }

      /* Updated toggle button styles */
      ::ng-deep .custom-toggle-group {
        border-radius: 8px;
        overflow: hidden;
      }

      ::ng-deep .custom-toggle {
        background-color: #1f2b3e;
      }

      ::ng-deep .custom-toggle .mat-button-toggle-label-content {
        color: #ffffff !important;
        line-height: 36px !important;
      }

      ::ng-deep .custom-toggle.mat-button-toggle-checked {
        background-color: #3d5a80;
      }

      ::ng-deep
        .custom-toggle.mat-button-toggle-checked
        .mat-button-toggle-label-content {
        color: #000000 !important;
      }

      /* Hide scrollbar for Chrome, Safari and Opera */
      .overflow-x-auto::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .overflow-x-auto {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `,
  ],
})
export class FeedComponent implements OnInit {
  favoriteTeamsWithGames: TeamWithGames[] = [];
  recommendedTeamsWithGames: TeamWithGames[] = [];
  isLoading = true;
  selectedView = 'favorite';
  private readonly RECOMMENDED_TEAM_IDS = [147, 119];
  private currentYear = new Date().getFullYear();

  get displayedTeams(): TeamWithGames[] {
    return this.selectedView === 'favorite'
      ? this.favoriteTeamsWithGames
      : this.recommendedTeamsWithGames;
  }

  constructor() {}

  async ngOnInit() {
    try {
      await this.loadAllMatches();
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onViewChange(event: any) {
    this.selectedView = event.value;
  }

  private getTeamLogoUrl(teamId: number): string {
    return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
  }

  private async loadAllMatches() {
    const favoriteTeams = this.getFavoriteTeams();
    const scheduleUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=${this.currentYear}`;
    const response = await fetch(scheduleUrl);
    const data = await response.json();

    // Process favorite teams
    this.favoriteTeamsWithGames = await Promise.all(
      favoriteTeams.map(async (teamId) => {
        const teamResponse = await fetch(
          `https://statsapi.mlb.com/api/v1/teams/${teamId}`
        );
        const teamData = await teamResponse.json();
        const teamName = teamData.teams[0].name;

        return {
          id: teamId,
          name: teamName,
          games: this.getUpcomingGamesForTeam(data, teamId),
          logoUrl: this.getTeamLogoUrl(teamId),
        };
      })
    );

    // Process recommended teams
    this.recommendedTeamsWithGames = await Promise.all(
      this.RECOMMENDED_TEAM_IDS.map(async (teamId) => {
        const teamResponse = await fetch(
          `https://statsapi.mlb.com/api/v1/teams/${teamId}`
        );
        const teamData = await teamResponse.json();
        const teamName = teamData.teams[0].name;

        return {
          id: teamId,
          name: teamName,
          games: this.getUpcomingGamesForTeam(data, teamId),
          logoUrl: this.getTeamLogoUrl(teamId),
        };
      })
    );
  }

  private getFavoriteTeams(): number[] {
    const teamsStr = localStorage.getItem('teams');
    if (!teamsStr) return [];
    return teamsStr.split(',').map((id) => parseInt(id));
  }

  private getUpcomingGamesForTeam(scheduleData: any, teamId: number): Game[] {
    const now = new Date();
    const allGames = scheduleData.dates
      .flatMap((date: any) => date.games)
      .filter((game: Game) => {
        const gameDate = new Date(game.gameDate);
        return (
          gameDate > now &&
          (game.teams.home.team.id === teamId ||
            game.teams.away.team.id === teamId)
        );
      })
      .sort(
        (a: Game, b: Game) =>
          new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime()
      );

    return allGames.slice(0, 2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
