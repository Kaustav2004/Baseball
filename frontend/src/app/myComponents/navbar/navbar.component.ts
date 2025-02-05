import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  imports: [CommonModule,RouterModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router){}
  isDropdownOpen = false;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('teams');
    localStorage.removeItem('players');
    this.router.navigate(['/auth']);
  }
}
