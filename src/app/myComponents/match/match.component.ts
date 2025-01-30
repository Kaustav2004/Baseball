import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-match',
  imports: [CommonModule],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css',
})
export class MatchComponent implements OnInit {
  matchId: string | null = null;

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
        videoUrl: string;
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
  videoUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

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
            imageUrl: response.media.epgAlternate[0].items[0].image.cuts[0].src,
            title: response.highlights.highlights.items[0].headline,
            date: new Date(response.editorial.recap.mlb.date).toDateString(),
            description: response.editorial.recap.mlb.blurb,
            videos: {},
          };
          let i = 0;
          response.highlights.highlights.items.forEach((video: any) => {
            const title = video.headline;
            const thumbnail = video.image.cuts[0].src;
            const videoUrl = video.playbacks[0].url;
            this.data.videos[i.toString()] = { title, thumbnail, videoUrl };
            i++;
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
    this.videoUrl = url;
    this.isVideoModalOpen = true;
  }

  // Close the video modal
  closeVideoModal() {
    this.isVideoModalOpen = false;
    this.videoUrl = '';
  }
}
