import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-report.component.html',
  styleUrl: './audit-report.component.css'
})
export class AuditReportComponent {
  isLightTheme: boolean = true;

  constructor(private themeService: ThemeService) {
  }


  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });

  }

}
