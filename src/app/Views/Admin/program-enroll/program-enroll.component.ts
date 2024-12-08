import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-program-enroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-enroll.component.html',
  styleUrl: './program-enroll.component.css'
})
export class ProgramEnrollComponent {
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
