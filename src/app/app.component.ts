import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

// Import Components

import { HomeComponent } from './myComponents/home/home.component';
import { PlayersComponent } from './myComponents/all-player/all-player.component';
import { AllTeamsComponent } from './myComponents/all-teams/all-teams.component';
import { ScheduleComponent } from './myComponents/schedule/schedule.component';
import { environment } from '../../enviourment';
import { ToastComponent } from '../../toast.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-players', component: PlayersComponent },
  { path: 'all-teams', component: AllTeamsComponent },
  { path: 'schedule', component: ScheduleComponent },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  connectionStatus: string = '';
  private db = getFirestore(initializeApp(environment.firebase));

  ngOnInit(): void {
    this.checkFirestoreConnection();
  }

  async checkFirestoreConnection(): Promise<void> {
    try {
      console.log('Starting Firestore connection...');
      const querySnapshot = await getDocs(collection(this.db, 'imageOrders'));

      if (querySnapshot.empty) {
        this.connectionStatus = "No data found in 'imageOrders' collection.";
        console.log('No data found.');
      } else {
        this.connectionStatus = 'Connected to Firestore!';
        console.log('Connected to Firestore!');
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
        });
      }
    } catch (error) {
      this.connectionStatus = 'Failed to connect to Firestore.';
      console.error('Error connecting to Firestore: ', error);
    }
  }
}
