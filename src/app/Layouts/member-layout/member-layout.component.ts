import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../Service/Theme/theme.service';


@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './member-layout.component.html',
  styleUrl: './member-layout.component.css'
})
export class MemberLayoutComponent implements OnInit {
  name:string = "Admin";
  
  isNavbarVisible: boolean = true; 
  navBarWidth: string = '450px'; 
  isDropdownOpen = false;
  isMoonButton = true;
  isLargeScreen: boolean = false;


  constructor(private themeService : ThemeService, private router: Router) {
   
   this.updateTheme();
  }

ngOnInit(): void {
  this.checkScreenSize();
  this.themeService.setNavbarVisibility(this.isNavbarVisible);
}

  logout(){
    localStorage.removeItem("Token");
    localStorage.removeItem("Name");
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
    this.navBarWidth = this.isNavbarVisible ? '450px' : '120px';

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
    { iconClass: 'bi bi-person', label: 'Profile', link: '/member/profile' }, 

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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 768; // Bootstrap lg breakpoint
  }

}
