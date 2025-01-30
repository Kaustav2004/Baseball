import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from '../../enviourment';
import { NavbarComponent } from './myComponents/navbar/navbar.component';
import { ToastrModule } from 'ngx-toastr';
import { ToastComponent } from '../../toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastrModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  connectionStatus: string = '';

  ngOnInit(): void {
    this.checkFirestoreConnection();
  }

  // Check Firestore connection
  checkFirestoreConnection(): void {
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
    console.log('Starting Firestore connection...');

    getDocs(collection(db, 'imageOrders'))
      .then((querySnapshot) => {
        console.log('Firestore Query Executed');
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
      })
      .catch((error) => {
        this.connectionStatus = 'Failed to connect to Firestore.';
        console.error('Error connecting to Firestore: ', error);
      });
  }
}
