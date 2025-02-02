import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-choose-players',
  imports: [CommonModule, FormsModule, NavbarComponent,MatProgressSpinnerModule],
  templateUrl: './choose-players.component.html',
  styleUrl: './choose-players.component.css'
})

export class ChoosePlayersComponent implements OnInit {
  data: { playerName: string; playerId: number }[] = [];
  selectedTeams: number[] = [];
  isLoading: boolean = true;
  showSpinner = false;

  constructor(private router: Router ,private http: HttpClient) {}
  ngOnInit(): void {
    if(!localStorage.getItem('token')){
      this.router.navigate(['/auth']);
    }

    if (localStorage.getItem('players') && localStorage.getItem('players')!== undefined && localStorage.getItem('players')!== "undefined") {
      this.router.navigate(['/']);
    } 
    this.fetchData();
  }

  // Fetch data from the API
  async fetchData(): Promise<void> {
    const apiUrl = 'https://statsapi.mlb.com/api/v1/sports/1/players?season=2025';
    this.http.get<{ people: any[] }>(apiUrl).subscribe({
      next: (response) => {
        this.data = response.people.map((player) => ({
          playerName: player.fullName,
          playerId: player.id,
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
    this.showSpinner=true;
    if (this.selectedTeams.length >= 3) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/favPlayers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:localStorage.getItem('token'),
            players:this.selectedTeams}),
        })

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('players',"Done");
          this.router.navigate(['/']);
        } else{
          this.router.navigate(['/choose-player']);
        }
      } catch (error) {
        this.router.navigate(['/choose-player']);
      } finally{
        this.showSpinner=false;
      }
    }
  }
}
