import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-choose-team',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './choose-team.component.html',
  styleUrl: './choose-team.component.css'
})

export class ChooseTeamComponent implements OnInit {

  ngOnInit(): void {
    // Fetch data based on the default year when the component loads
     this.fetchData();
     console.log(this.data);
  }
  isLoading: boolean = true;

  data: { 
    [key: string]: { 
      teamName: string | null; 
      teamId: number | null 
    } 
  } = {};

  constructor(private http: HttpClient) {}



  async fetchData(): Promise<void> {
    const apiUrl = 'https://statsapi.mlb.com/api/v1/teams?sportId=1';
    this.http.get<{
      teams: any; dates: any[] 
}>(apiUrl).subscribe({
      next: (response) => {
        console.log(response);
        response.teams.forEach((team:any) => {
          this.data[team.id] = {
            teamName: team.name,
            teamId: team.id,
          };
        });
        
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

}