import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../Service/Theme/theme.service';


@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './member-layout.component.html',
  styleUrl: './member-layout.component.css'
})
export class MemberLayoutComponent {
  name:string = "Admin";
  
  isNavbarVisible: boolean = true; // Controls whether the sidebar is visible
  navBarWidth: string = '250px'; // Default sidebar width
  isScreenMedium: boolean = false; // Tracks if the screen is medium or smaller
  isDropdownOpen = false;
  isMoonButton = true;


  constructor(private themeService : ThemeService, private router: Router) {
   //this.checkScreenSize();
   this.updateTheme();
  }
  logout(){
    localStorage.removeItem("Token");
    localStorage.removeItem("Name");
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
    this.navBarWidth = this.isNavbarVisible ? '250px' : '90px';

  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  toggleTheme(): void {
    this.isMoonButton = !this.isMoonButton;
    this.updateTheme();
    this.toggleLocalStorage();
    this.toggleRootClass();
  }

  private toggleRootClass(): void {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const invertedTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', invertedTheme);
  }

  private toggleLocalStorage(): void {
    if (this.isLight()) {
      localStorage.removeItem("light");
    } else {
      localStorage.setItem("light", "set");
    }
  }

  private isLight(): boolean {
    return localStorage.getItem("light") !== null;
  }

  private initializeTheme(): void {
    if (this.isLight()) {
      this.toggleRootClass();
    }
  }

  private updateTheme(): void {
    this.themeService.setLightTheme(this.isMoonButton); // Update the service's lightTheme variable
  }



  navItems = [
    { iconClass: 'bi bi-calculator', label: 'Calculate BMI', link: '/member/bmi' },
    { iconClass: 'bi bi-credit-card-2-back', label: 'Make Payment', link: '/member/payment' },
    { iconClass: 'fas fa-dumbbell', label: 'Change Programs', link: '/member/change-program' },
    { iconClass: 'fas fa-file-invoice-dollar', label: 'Payment History', link: '/member/payment-history' },

    // { iconClass: 'bi bi-clipboard2-data', label: 'Reports', link: '#', submenu: [
    //   { iconClass: 'fas fa-user-tie', label: 'Member Report', link: '#' },
    //   { iconClass: 'fas fa-file-alt', label: 'Program Report', link: '#' },
    //   { iconClass: 'fas fa-clipboard-list', label: 'Audit Report', link: '#' }
    // ], submenuVisible: false }

  ];

  selectedIndex: number = 0;  // To track the selected item

  // Toggle submenu visibility
  toggleSubmenu(index: number) {
    // this.navItems[index].submenuVisible = !this.navItems[index].submenuVisible;
  }

  // Select the item and change the active state
  selectItem(index: number) {
    this.selectedIndex = index;
  }

}
