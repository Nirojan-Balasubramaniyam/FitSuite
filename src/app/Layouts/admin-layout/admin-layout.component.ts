import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../Service/Theme/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent  {
  name:string = "Admin";
  
  isNavbarVisible: boolean = true; // Controls whether the sidebar is visible
  navBarWidth: string = '250px'; // Default sidebar width
  isScreenMedium: boolean = false; // Tracks if the screen is medium or smaller
  isDropdownOpen = false;
  isMoonButton = true;
  userRole:string='';
  branchId:number=1;


  constructor(private themeService : ThemeService, private router: Router) {
    const role = localStorage.getItem('Role') || '';
    const branchId = localStorage.getItem('BranchId');

    this.userRole = role;
    this.branchId = branchId ? parseInt(branchId) : 0;

   

   //this.checkScreenSize();
   this.updateTheme();
  }
  
  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('Name');
    localStorage.removeItem('Role');
    localStorage.removeItem('UserId');
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
    { iconClass: 'bi bi-speedometer2', label: 'Dashboard', link: '/admin/dashboard' },
    { iconClass: 'bi bi-kanban', label: 'Management', link: '#' },
    { iconClass: 'bi bi-terminal-plus', label: 'Enroll Program', link: '/admin/dashboard' },
    { iconClass: 'bi bi-credit-card-2-back', label: 'Payment', link: '/admin/dashboard' },
    { iconClass: 'fa-solid fa-code-pull-request', label: 'Approval Requests', link: '/admin/dashboard' },
    { iconClass: 'bi bi-clipboard2-data', label: 'Reports', link: '#'},
    { iconClass: 'bi bi-diagram-3', label: 'Branches', link: '/admin/branch' }
  ];

  selectedIndex: number = 0;  // To track the selected item

  // Toggle submenu visibility
  toggleSubmenu(index: number) {
    //this.navItems[index].submenuVisible = !this.navItems[index].submenuVisible;
  }

  // Select the item and change the active state
  selectItem(index: number) {
    this.selectedIndex = index;
  }
}
