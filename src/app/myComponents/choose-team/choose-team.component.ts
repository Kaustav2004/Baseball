import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-choose-team',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './choose-team.component.html',
  styleUrl: './choose-team.component.css',
})
export class ChooseTeamComponent implements OnInit {
  data: { teamName: string; teamId: number }[] = [];
  selectedTeams: number[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  // Fetch data from the API
  async fetchData(): Promise<void> {
    const apiUrl = 'https://statsapi.mlb.com/api/v1/teams?sportId=1';
    this.http.get<{ teams: any[] }>(apiUrl).subscribe({
      next: (response) => {
        this.data = response.teams.map((team) => ({
          teamName: team.name,
          teamId: team.id,
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      },
    });
  }

  // Toggle team selection
  toggleTeamSelection(teamId: number): void {
    const index = this.selectedTeams.indexOf(teamId);
    if (index > -1) {
      this.selectedTeams.splice(index, 1); // Deselect if already selected
    } else if (this.selectedTeams.length < 5) {
      this.selectedTeams.push(teamId); // Allow selecting up to 5 teams
    }
  }

  // Check if a team is selected
  isTeamSelected(teamId: number): boolean {
    return this.selectedTeams.includes(teamId);
  }

  // Continue button action
  continue(): void {
    if (this.selectedTeams.length >= 3) {
      console.log('Selected Teams:', this.selectedTeams);
      alert(`You have selected teams with IDs: ${this.selectedTeams.join(', ')}`);
    }
  }
}
