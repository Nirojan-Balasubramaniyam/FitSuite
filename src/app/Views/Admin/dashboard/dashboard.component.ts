import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportService } from '../../../Service/Admin/Report/report.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ThemeService } from '../../../Service/Theme/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  isLightTheme: boolean = true;

  constructor(
    private themeService: ThemeService,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
    this.spinner.show();
  }

}
