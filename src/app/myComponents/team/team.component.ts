// team.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

interface Team {
  id: number;
  name: string;
  teamName: string;
  locationName: string;
  venue: {
    name: string;
  };
  league: {
    name: string;
  };
  division: {
    name: string;
  };
  firstYearOfPlay: string;
  shortName: string;
  clubName: string;
}

interface RosterPlayer {
  person: {
    id: number;
    fullName: string;
  };
  jerseyNumber: string;
  position: {
    name: string;
    abbreviation: string;
  };
  status: {
    description: string;
  };
}
interface Game {
  gamePk: number;
  gameDate: string;
  teams: {
    away: {
      team: {
        id: number;
        name: string;
      };
      score: number;
      isWinner: boolean;
    };
    home: {
      team: {
        id: number;
        name: string;
      };
      score: number;
      isWinner: boolean;
    };
  };
  venue: {
    name: string;
  };
  status: {
    abstractGameState: string; // Add abstractGameState
  };
}
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html', // Make sure you have this line
  imports: [CommonModule, DatePipe], // Add DatePipe to imports
  providers: [DatePipe], // Add DatePipe to providers
  styles: [],
})
export class TeamComponent implements OnInit {
  team: Team | null = null;
  error: string | null = null;
  roster: RosterPlayer[] | null = null;
  rosterError: string | null = null;
  displayedRoster: RosterPlayer[] = [];
  showFullRoster = false;
  games: Game[] = [];
  gamesError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public datePipe: DatePipe
  ) {} // Inject DatePipe

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const teamId = params.get('teamId');
      if (teamId) {
        this.fetchTeamData(teamId);
        this.fetchRosterData(teamId);
        this.fetchGamesData(teamId); // Fetch roster data
      } else {
        this.error = 'Team ID is missing in the URL.';
      }
    });
  }

  fetchTeamData(teamId: string): void {
    const apiUrl = 'https://statsapi.mlb.com/api/v1/teams?sportId=1';

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        const teams: Team[] = data.teams;
        const selectedTeam = teams.find((team) => team.id === +teamId);
        if (selectedTeam) {
          this.team = selectedTeam;
          this.error = null;
        } else {
          this.error = 'Team not found.';
          this.team = null;
        }
      },
      error: (error) => {
        this.error = 'Error fetching team data. Please try again later.';
        this.team = null;
        console.error(error);
      },
    });
  }

  fetchRosterData(teamId: string): void {
    const apiUrl = `https://statsapi.mlb.com/api/v1/teams/${teamId}/roster?season=2025`;
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.roster = data.roster;
        this.rosterError = null;
        this.updateDisplayedRoster(); // Update initially
      },
      error: (error) => {
        this.rosterError =
          'Error fetching roster data. Please try again later.';
        this.roster = null;
        console.error(error);
      },
    });
  }
  fetchGamesData(teamId: string): void {
    const apiUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2024`; // Adjust the year if needed

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        const allGames: Game[] = [];
        data.dates.forEach((dateData: any) => {
          dateData.games.forEach((gameData: any) => {
            allGames.push(gameData);
          });
        });
        this.games = allGames.filter((game) => {
          return (
            game.teams.away.team.id === +teamId ||
            game.teams.home.team.id === +teamId
          );
        });
        this.gamesError = null;
      },
      error: (error) => {
        this.gamesError = 'Error fetching games data. Please try again later.';
        this.games = [];
        console.error(error);
      },
    });
  }
  showMore() {
    this.showFullRoster = true;
    this.updateDisplayedRoster();
  }

  showLess() {
    this.showFullRoster = false;
    this.updateDisplayedRoster();
  }

  updateDisplayedRoster() {
    if (this.roster) {
      this.displayedRoster = this.showFullRoster
        ? this.roster
        : this.roster.slice(0, 6);
    }
  }
}
