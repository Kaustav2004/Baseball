import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Team {
  id: number;
  name: string;
  teamName: string;
  league: {
    name: string;
  };
  division: {
    name: string;
  };
  venue: {
    name: string;
  };
  firstYearOfPlay: string;
}

@Component({
  selector: 'app-all-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4 bg-bg-100 min-h-screen">
      <!-- Search Bar -->
      <div class="mb-8">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch($event)"
          placeholder="Search teams..."
          class="w-full p-3 rounded-lg border border-accent-100 bg-bg-200 text-text-100 placeholder-text-200 focus:outline-none focus:border-accent-200"
        />
      </div>

      <!-- Teams Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          *ngFor="let team of filteredTeams"
          (click)="navigateToTeam(team.id)"
          class="bg-bg-200 rounded-lg p-6 cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-bg-300 border border-accent-100"
        >
          <!-- Team Logo -->
          <div
            class="mb-4 flex justify-center items-center h-48 bg-bg-300 rounded-lg p-4"
          >
            <img
              [src]="getTeamLogo(team.id)"
              [alt]="team.name"
              class="max-h-full max-w-full object-contain"
              (error)="onImageError($event)"
            />
          </div>

          <!-- Team Info -->
          <div class="text-center">
            <h3 class="text-xl font-bold mb-2 text-text-100">
              {{ team.name }}
            </h3>
            <p class="text-text-200 mb-1">{{ team.league.name }}</p>
            <p class="text-text-200 mb-2">{{ team.division.name }}</p>
            <p class="text-accent-200">{{ team.venue.name }}</p>
            <p class="text-text-200 text-sm mt-2">
              Est. {{ team.firstYearOfPlay }}
            </p>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div
        *ngIf="filteredTeams.length === 0"
        class="text-center text-text-200 mt-8"
      >
        No teams found matching your search.
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AllTeamsComponent implements OnInit {
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.filterTeams(term);
      });
  }

  ngOnInit() {
    this.fetchTeams();
  }

  fetchTeams() {
    this.http
      .get<any>('https://statsapi.mlb.com/api/v1/teams?sportId=1')
      .subscribe((response) => {
        this.teams = response.teams;
        this.filteredTeams = this.teams;
      });
  }

  getTeamLogo(teamId: number): string {
    return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/placeholder-team.png'; // Replace with your placeholder image
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  filterTeams(term: string) {
    if (!term) {
      this.filteredTeams = this.teams;
      return;
    }

    term = term.toLowerCase();
    this.filteredTeams = this.teams.filter(
      (team) =>
        team.name.toLowerCase().includes(term) ||
        team.teamName.toLowerCase().includes(term) ||
        team.venue.name.toLowerCase().includes(term)
    );
  }

  navigateToTeam(teamId: number) {
    this.router.navigate(['/team', teamId]);
  }
}
