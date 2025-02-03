import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Player {
  id: number;
  fullName: string;
  primaryPosition: {
    name: string;
    type: string;
  };
  active: boolean;
  currentTeam?: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-player.component.html',
  styles: [
    `
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `,
  ],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.filterPlayers(term);
      });
  }

  ngOnInit() {
    this.fetchPlayers();
  }

  fetchPlayers() {
    this.http
      .get<any>('https://statsapi.mlb.com/api/v1/sports/1/players?season=2024')
      .subscribe((response) => {
        this.players = response.people;
        this.filteredPlayers = this.players;

        // Fetch team names
        this.players.forEach((player) => {
          if (player.currentTeam?.id) {
            this.fetchTeamName(player.currentTeam.id).then((teamName) => {
              player.currentTeam!.name = teamName;
            });
          }
        });
      });
  }

  async fetchTeamName(teamId: number): Promise<string> {
    return this.http
      .get<any>(`https://statsapi.mlb.com/api/v1/teams/${teamId}`)
      .toPromise()
      .then((response) => response.teams[0].name)
      .catch(() => 'Unknown Team');
  }

  getPlayerHeadshot(playerId: number): string {
    return `https://securea.mlb.com/mlb/images/players/head_shot/${playerId}.jpg`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/placeholder-player.png';
  }

  getCategories(): string[] {
    const positions = new Set(
      this.filteredPlayers.map(
        (player) => player.primaryPosition?.type || 'Unknown'
      )
    );
    return Array.from(positions);
  }

  filterPlayersByCategory(category: string): Player[] {
    return this.filteredPlayers.filter(
      (player) => player.primaryPosition?.type === category
    );
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  filterPlayers(term: string) {
    if (!term) {
      this.filteredPlayers = this.players;
      return;
    }
    term = term.toLowerCase();
    this.filteredPlayers = this.players.filter((player) =>
      player.fullName.toLowerCase().includes(term)
    );
  }

  scroll(category: string, direction: 'left' | 'right') {
    const container = document.getElementById(`slider-${category}`);
    if (container) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
    }
  }

  hasScrollableContent(category: string): boolean {
    const container = document.getElementById(`slider-${category}`);
    return container ? container.scrollWidth > container.clientWidth : false;
  }

  navigateToPlayer(playerId: number) {
    this.router.navigate(['/team-page', playerId]);
  }
}
