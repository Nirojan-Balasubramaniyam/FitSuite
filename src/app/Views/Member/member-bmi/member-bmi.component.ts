import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../Service/Theme/theme.service';

@Component({
  selector: 'app-member-bmi',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './member-bmi.component.html',
  styleUrl: './member-bmi.component.css'
})
export class MemberBmiComponent implements OnInit {

  weight: number = 70;
  height: number = 170;
  bmi: number = 0;
  healthStatus: string = '';
  healthClass: string = 'normal-weight';
  isLightTheme: boolean = true;


  constructor(private themeService: ThemeService) {
      this.calculateBMI();
  }

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });
  }

  calculateBMI(): void {
      const heightInMeters = this.height / 100;
      this.bmi = this.weight / (heightInMeters * heightInMeters);
      this.updateHealthStatus();
  }

  updateHealthStatus(): void {
    if (this.bmi < 18.5) {
        this.healthStatus = 'Underweight';
        this.healthClass = 'underweight';
    } else if (this.bmi >= 18.5 && this.bmi < 24.9) {
        this.healthStatus = 'Normal weight';
        this.healthClass = 'normal-weight';
    } else if (this.bmi >= 25 && this.bmi < 29.9) {
        this.healthStatus = 'Overweight';
        this.healthClass = 'overweight';
    } else {
        this.healthStatus = 'Obesity';
        this.healthClass = 'obesity';
    }
  }

}
