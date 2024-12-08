import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-report.component.html',
  styleUrl: './member-report.component.css'
})
export class MemberReportComponent {
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
