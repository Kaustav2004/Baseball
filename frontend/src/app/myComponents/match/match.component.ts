import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-match',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css',
})
export class MatchComponent implements OnInit {
  matchId: string | null = null;
  highlights: boolean | true = true;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.matchId = this.route.snapshot.paramMap.get('matchId');
    if (this.matchId) {
      this.fetchData();
    }
  }

  data: {
    imageUrl: string | null;
    title: string | null;
    date: string | null;
    description: string | null;
    videos: {
      [key: string]: {
        title: string;
        thumbnail: string;
        videoUrl: string; // Changed to string
      };
    };
  } = {
    imageUrl: null,
    title: null,
    date: null,
    description: null,
    videos: {},
  };

  isLoading: boolean = true;
  errorMessage: string | null = null;
  isVideoModalOpen: boolean = false;
  videoUrl: string = ''; // Changed to string

  fetchData(): void {
    const apiUrl = `https://statsapi.mlb.com/api/v1/game/${this.matchId}/content`;
    this.http
      .get<{
        highlights: any;
        editorial: any;
        media: any;
        epgAlternate: any;
        imageUrl: string;
        title: string;
        description: string;
        videoUrls: { url: string }[];
      }>(apiUrl)
      .subscribe({
        next: (response) => {
          this.data = {
            imageUrl: response.media.epgAlternate[0]?.items[0]?.image.cuts[0]?.src || '',
            title: response.highlights.highlights.items[0]?.headline || 'No Title Available',
            date: new Date(response.editorial.recap.mlb.date).toDateString(),
            description: response.editorial.recap.mlb.blurb || 'No Description Available',
            videos: {},
          };
          response.highlights.highlights.items.forEach((video: any, index: number) => {
            const title = video.headline;
            const thumbnail = video.image.cuts[0]?.src || '';
            const videoUrl = video.playbacks[0]?.url || ''; // Directly using the URL
            this.data.videos[index.toString()] = { title, thumbnail, videoUrl };
          });
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load data. Please try again.';
          console.error(error);
          this.isLoading = false;
        },
      });
  }

  // Get all video values from the 'videos' object
  getVideos() {
    return Object.values(this.data.videos);
  }

  // Open the video modal and set the video URL
  openVideoModal(url: string) {
    this.videoUrl = url; // No need for sanitization
    this.isVideoModalOpen = true;
  }

  // Close the video modal
  closeVideoModal() {
    this.isVideoModalOpen = false;
    this.videoUrl = '';
  }
}
