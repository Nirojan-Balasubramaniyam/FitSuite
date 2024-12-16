import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ThemeService } from '../../Service/Theme/theme.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../Models/member';
import { AdminService } from '../../Service/Staff/admin.service';
import { AlertService } from '../../Service/Admin/Alert/alert.service';
import { Alert } from '../../Models/overdueAlert';
import { TrainingProgram } from '../../Models/trainingProgram';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    BsDatepickerModule,
  ],
  templateUrl: './member-layout.component.html',
  styleUrl: './member-layout.component.css',
})
export class MemberLayoutComponent implements OnInit {
  name: string = 'Admin';

  isNavbarVisible: boolean = true;
  navBarWidth: string = '450px';
  isDropdownOpen = false;
  isMoonButton = true;
  isLargeScreen: boolean = false;
  memberId!: number;
  member: Member | null = null;
  alerts: Alert[] = [
    {
      alertId: 1,
      alertType: 'overdue',
      memberId: 101,
      amount: 1500,
      dueDate: '2024-11-30T00:00:00',
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: false,
    },
    {
      alertId: 2,
      alertType: 'renewal',
      memberId: 102,
      amount: 2000,
      dueDate: '2024-12-10T00:00:00',
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: true,
    },
    {
      alertId: 3,
      alertType: 'paymentrequestMessage',
      memberId: 103,
      amount: 2500,
      dueDate: '2024-12-15T00:00:00',
      accessedDate: '2024-12-04T00:00:00',
      status: true,
      action: true,
    },
    {
      alertId: 4,
      alertType: 'leaveProgramRequestMessage',
      memberId: 104,
      programId: 501,
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: true,
    },
    {
      alertId: 5,
      alertType: 'programAddonRequestMessage',
      memberId: 105,
      programId: 502,
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: true,
    },
    {
      alertId: 6,
      alertType: 'memberInfoRequestMessage',
      memberId: 106,
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: true,
    },
    {
      alertId: 7,
      alertType: 'paymentrequestMessage',
      memberId: 107,
      amount: 1800,
      dueDate: '2024-12-10T00:00:00',
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: false,
    },
    {
      alertId: 8,
      alertType: 'leaveProgramRequestMessage',
      memberId: 108,
      programId: 5,
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: false,
    },
    {
      alertId: 9,
      alertType: 'programAddonRequestMessage',
      memberId: 109,
      programId: 5,
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: false,
    },
    {
      alertId: 10,
      alertType: 'memberInfoRequestMessage',
      memberId: 110,
      accessedDate: '2024-12-05T00:00:00',
      status: true,
      action: false,
    },
  ];
  // fullImgPath: string = 'https://gymfeemanagementsystem-appservice.azurewebsites.net';
  modalRef?: BsModalRef;
  @ViewChild('memberFormTemplate') memberFormTemplate!: TemplateRef<any>;
  notifications: Alert[] = [];
  members: Member[] = [];
  programs: TrainingProgram[] = [];
  loggedInUser = { memberId: 1 };

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.updateTheme();

    const memberId = localStorage.getItem('UserId');

    this.memberId = memberId ? parseInt(memberId) : 0;

    this.loadMember();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadAlerts();
    this.checkScreenSize();
    this.themeService.setNavbarVisibility(this.isNavbarVisible);
    this.loadMember();
    this.loadPrograms();
  }

  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('Name');
    localStorage.removeItem('Role');
    localStorage.removeItem('UserId');
    this.router.navigate(['/login']);
  }

  loadAlerts(): void {
    this.alertService
      .getAlertsByMemberId(this.memberId)
      .subscribe((response) => {
        this.alerts = response;

        this.spinner.hide();
      });
  }

  loadPrograms(): void {
    this.adminService.getAllTrainingPrograms().subscribe((programs) => {
      this.programs = programs;

      this.spinner.hide();
    });
  }

  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
    this.navBarWidth = this.isNavbarVisible ? '450px' : '0px';
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
      localStorage.removeItem('light');
    } else {
      localStorage.setItem('light', 'set');
    }
  }

  private isLight(): boolean {
    return localStorage.getItem('light') !== null;
  }

  private initializeTheme(): void {
    if (this.isLight()) {
      this.toggleRootClass();
    }
  }

  private updateTheme(): void {
    this.themeService.setLightTheme(this.isMoonButton); // Update the service's lightTheme variable
  }

  loadMember(): void {
    this.adminService.getMember(this.memberId).subscribe((response) => {
      this.member = response;

      console.log(this.member);

      this.spinner.hide();
    });
  }

  navItems = [
    {
      iconClass: 'bi bi-calculator',
      label: 'Calculate BMI',
      link: '/member/bmi',
    },
    {
      iconClass: 'bi bi-credit-card-2-back',
      label: 'Make Payment',
      link: '/member/payment',
    },
    {
      iconClass: 'fas fa-dumbbell',
      label: 'Change Programs',
      link: '/member/change-program',
    },
    {
      iconClass: 'fas fa-file-invoice-dollar',
      label: 'Payment History',
      link: '/member/payment-history',
    },
    { iconClass: 'bi bi-person', label: 'Profile', link: '/member/profile' },
  ];

  selectedIndex: number = 0; // To track the selected item

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

  constructAlertContent(alert: Alert): string {
    let programName = '';

    if (alert.programId) {
      const program = this.programs.find(
        (p) => p.programId === alert.programId
      );
      programName = program ? program.programName : 'Unknown Program';
    }

    let alertContent = '';

    if (alert.status) {
      if (alert.alertType === 'overdue' || alert.alertType === 'renewal') {
        alertContent = `You have the ${alert.alertType} alert of Rs ${alert.amount}: Due Date is ${alert.dueDate}`;
      } else if (alert.action) {
        // Accepted actions
        switch (alert.alertType) {
          case 'paymentrequestMessage':
            alertContent = `Your Payment Request of Rs ${alert.amount} was accepted! Next Due Date is ${alert.dueDate}`;
            break;
          case 'leaveProgramRequestMessage':
            alertContent = `Your Leave Request for activity ${programName} was accepted!`;
            break;
          case 'programAddonRequestMessage':
            alertContent = `Your Enroll Program Request for activity ${programName} was accepted!`;
            break;
          case 'memberInfoRequestMessage':
            alertContent = `Your Member Information Change Request was accepted!`;
            break;
          default:
            alertContent = 'Action accepted, but no specific message';
        }
      } else {
        // Declined actions
        alertContent = this.handleDeclineAlerts(alert, programName);
      }
    } else {
      alertContent = 'This alert has been closed';
    }

    return alertContent;
  }

  // Handle declined alerts
  handleDeclineAlerts(alert: Alert, programName: string): string {
    let declinedMessage = '';

    switch (alert.alertType) {
      case 'paymentrequestMessage':
        declinedMessage = `Your Payment Request of Rs ${alert.amount} was declined!`;
        break;
      case 'leaveProgramRequestMessage':
        declinedMessage = `Your Leave Request for activity ${programName} was declined!`;
        break;
      case 'programAddonRequestMessage':
        declinedMessage = `Your Enroll Program Request for activity ${programName} was declined!`;
        break;
      case 'memberInfoRequestMessage':
        declinedMessage = `Your Member Information Change Request was declined!`;
        break;
      default:
        declinedMessage = 'Your request was declined';
    }

    return declinedMessage;
  }

  // Mark the alert as closed
  closeAlert(alertId: number) {
    const alertToUpdate = this.alerts.find(
      (alert) => alert.alertId === alertId
    );
    if (alertToUpdate) {
      alertToUpdate.status = false;

      this.alertService
        .updateAlert(alertId, alertToUpdate)
        .subscribe((response) => {});
      this.alerts = this.alerts.filter((alert) => alert.alertId !== alertId);
    }
  }


  openModalWithClass(template: TemplateRef<void>) {
    console.log(this.memberId);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );

    this.modalRef.onHide?.subscribe(() => {
      
      // Reset form when modal is closed
    });
  }

}
