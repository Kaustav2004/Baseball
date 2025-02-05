import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../enviourments/enviourment';

@Component({
  selector: 'app-choose-team',
  imports: [CommonModule, FormsModule, NavbarComponent,MatProgressSpinnerModule],
  templateUrl: './choose-team.component.html',
  styleUrl: './choose-team.component.css',
})
export class ChooseTeamComponent implements OnInit {
  apiUrl = environment.API_URL;
  data: { teamName: string; teamId: number }[] = [];
  selectedTeams: number[] = [];
  isLoading: boolean = true;
  showSpinner = false;

  constructor(private router: Router ,private http: HttpClient) {}
  ngOnInit(): void {
    if(!localStorage.getItem('token')){
      this.router.navigate(['/auth']);
    }

    if (localStorage.getItem('teams') && localStorage.getItem('teams')!==undefined && localStorage.getItem('teams')!== "undefined") {
      this.router.navigate(['/choose-player']);
    } 
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
    } else{
      this.selectedTeams.push(teamId); // Allow selecting up to 5 teams
    }
  }

  // Check if a team is selected
  isTeamSelected(teamId: number): boolean {
    return this.selectedTeams.includes(teamId);
  }

  // Continue button action
  async continue(): Promise<void> {

    if (this.selectedTeams.length >= 3) {
      try {
        const response = await fetch(`${this.apiUrl}api/v1/favTeams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:localStorage.getItem('token'),
            teams:this.selectedTeams}),
        })

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('teams', JSON.stringify(this.selectedTeams));
          this.router.navigate(['/choose-player']);
        } else{
          this.router.navigate(['/choose-team']);
        }
      } catch (error) {
        this.router.navigate(['/choose-team']);
      }
    }
  }
}
