import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  imports: [CommonModule, FormsModule, NavbarComponent],
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  isLoading: boolean = true;
  year: string = '2025'; // Default year
  selectedDate: string = '';  // Holds the selected date in "yyyy-mm-dd" format
  dateKeys: string[] = [];  // Array to store the dates for iteration
  data = {
    games: {} as {
      [date: string]: Array<{
        title: string;
        gameId: number;
        team1: string;
        team1Id: number;
        team2: string;
        team2Id: number;
        gameTime: string;
        venue: string;
        seriesDescription: string;
      }>;
    }
  };

  matchesForSelectedDate: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch data based on the default year when the component loads
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    const apiUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=${this.year}`;
    this.http.get<{ dates: any[] }>(apiUrl).subscribe({
      next: (response) => {
        this.data.games = {}; // Clear any existing data
        response.dates.forEach((date) => {
          const dateString = date.date;
          this.data.games[dateString] = date.games.map((game: any) => ({
            title: game.seriesDescription,
            gameId: game.gamePk,
            team1: game.teams.away.team.name,
            team1Id: game.teams.away.team.id,
            team2: game.teams.home.team.name,
            team2Id: game.teams.home.team.id,
            gameTime: new Date(game.gameDate).toTimeString().split(' ')[0],
            venue: game.venue.name,
            seriesDescription: game.seriesDescription,
          }));
        });

        // Get the keys of the dates to render them
        this.dateKeys = Object.keys(this.data.games);

        // Default to displaying all matches for the year when the page loads
        if (!this.selectedDate) {
          this.selectedDate = '';  // Set to empty string so all matches show
          this.matchesForSelectedDate = Object.values(this.data.games).flat();
        }
        console.log(this.data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  onDateChange(): void {
    if (this.selectedDate) {
      this.matchesForSelectedDate = this.data.games[this.selectedDate] || [];
    }
  }

  formatDate(date: string): string {
    if (!date) return '2025 Year';
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    const daySuffix = this.getDaySuffix(day);
    return `${day}${daySuffix} ${month} ${year}`;
  }

  getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  formatTime(timeString: string): string {
    const date = new Date('1970-01-01T' + timeString + 'Z'); // Convert to Date object
    let hours: number = date.getUTCHours();
    let minutes: number = date.getUTCMinutes();
    let ampm: string = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;  // Convert hours to 12-hour format
    hours = hours ? hours : 12; // If hours is 0, set it to 12 (12 AM)
    minutes = minutes < 10 ? minutes : minutes; // Ensure minutes are two digits
  
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }
}
