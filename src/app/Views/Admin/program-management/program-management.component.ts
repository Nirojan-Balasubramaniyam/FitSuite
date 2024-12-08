import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-program-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-management.component.html',
  styleUrl: './program-management.component.css'
})
export class ProgramManagementComponent {
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
