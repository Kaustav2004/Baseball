import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ToastService } from '../../../../toast.service';
import { environment } from '../../../enviourments/enviourment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
})

export class SignupComponent implements OnInit {
  apiUrl = environment.API_URL;
  currentForm: 'login' | 'signup' = 'login';
  showSpinner = false;

  // Form data
  loginData = {
    email: '',
    password: ''
  };

  signupData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private router: Router , private toastr: ToastrService,private toastService: ToastService) {}

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.router.navigate(['/']);
    }
    const video = document.getElementById('backgroundVideo') as HTMLVideoElement;
    if (video) {
      video.muted = true;
      video.play().catch((error) => {
        console.error('Error playing the video:', error);
      });
    }
  }

  // Display a success toast
   showSuccess(message: string, title: string = 'success'): void {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-center',
      progressBar: true,
      closeButton: true,
    });
  }

  // Display an error toast
   showError(message: string, title: string = 'error'): void {
    this.toastr.error(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-center',
      progressBar: true,
      closeButton: true,
    });
  }

  // Switch between login and signup forms
  showForm(formType: 'login' | 'signup'): void {
    this.currentForm = formType;
  }

  // Handle login
  async onLogin(): Promise<void> {
    if (!this.loginData.email || !this.loginData.password) {
      this.toastService.showToast('error', 'All fields are required', 'Error');
      // this.showError('Email and password are required.');
      return;
    }

    this.showSpinner = true;

    try {
      const response = await fetch(`${this.apiUrl}api/v1/logIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loginData),
      });

      const data = await response.json();

      if (data.success) {
        this.toastService.showToast('success', 'LogIn successful!', 'Success');
        localStorage.setItem('token', data.token.email);
        localStorage.setItem('teams',data.token.favTeams);
        localStorage.setItem('players',data.token.favPlayers);
        console.log(localStorage.getItem('teams'));
        console.log(localStorage.getItem('players'));
        this.router.navigate(['/choose-team']);
      } else {
        this.toastService.showToast('error', 'LogIn Failed!', 'Error');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.toastService.showToast('error', 'LogIn Failed!', 'Error');
      // this.showError('An error occurred during login. Please try again.');
    } finally {
      this.showSpinner = false;
      this.loginData.email = '';
      this.loginData.password = '';
    }
  }

  // Handle signup
  async onSignup(): Promise<void> {
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password) {
      this.toastService.showToast('error', 'All fields are required', 'Error');
      // this.showError('All fields are required.');
      return;
    }

    this.showSpinner = true;

    try {
      const response = await fetch(`${this.apiUrl}api/v1/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.signupData),
      });

      const data = await response.json();

      if (data.success) {
        this.toastService.showToast('success', 'Signup successful!', 'Success');
        // this.showSuccess('Signup successful!');
        this.showForm('login');
      } else {
        this.toastService.showToast('error', 'Signup failed!', 'Error');
        // this.showError(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // this.showError('An error occurred during signup. Please try again.');
      this.toastService.showToast('error', 'Signup failed!', 'Error');
    } finally {
      this.showSpinner = false;
      this.signupData.name = '';
      this.signupData.email = '';
      this.signupData.password = '';
    }
  }
}
