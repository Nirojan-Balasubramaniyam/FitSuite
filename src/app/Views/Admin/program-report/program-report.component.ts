import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-program-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-report.component.html',
  styleUrl: './program-report.component.css'
})
export class ProgramReportComponent {
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
