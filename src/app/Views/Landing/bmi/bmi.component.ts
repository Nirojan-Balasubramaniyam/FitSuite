import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmi',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './bmi.component.html',
  styleUrl: './bmi.component.css'
})
export class BMIComponent {
  height: number | null = null; 
  weight: number | null = null; 
  bmi: number | null = null;
  healthStatus: string = '';

  calculateBMI(): void {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100; 
      this.bmi = +(this.weight / (heightInMeters * heightInMeters)).toFixed(1);

      if (this.bmi < 18.5) {
        this.healthStatus = 'Underweight';
      } else if (this.bmi >= 18.5 && this.bmi < 24.9) {
        this.healthStatus = 'Normal weight';
      } else if (this.bmi >= 25 && this.bmi < 29.9) {
        this.healthStatus = 'Overweight';
      } else {
        this.healthStatus = 'Obesity';
      }
    } else {
      this.bmi = null;
      this.healthStatus = 'Please provide valid inputs!';
    }
  }

}
