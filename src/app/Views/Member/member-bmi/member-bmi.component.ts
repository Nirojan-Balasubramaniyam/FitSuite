import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-bmi',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './member-bmi.component.html',
  styleUrl: './member-bmi.component.css'
})
export class MemberBmiComponent {

  unit: string = 'Standard';
  age: number | null = null;
  gender: string = 'Male';
  heightFeet: number | null = null;
  heightInches: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  bmi: number | null = null;
  bmiCategory: string = '';

  setUnit(unit: string) {
    this.unit = unit;
    this.height = null;
    this.heightFeet = null;
    this.heightInches = null;
    this.weight = null;
    this.bmi = null;
    this.bmiCategory = '';  
  }

  calculateBMI() {
    let heightInMeters: number;

    if (this.unit === 'Standard') {
      if (this.heightFeet === null || this.heightInches === null || this.weight === null) return;
      heightInMeters = ((this.heightFeet * 12) + this.heightInches) * 0.0254;
      this.bmi = this.weight / (heightInMeters ** 2) * 703;
    } else {
      if (this.height === null || this.weight === null) return;
      heightInMeters = this.height / 100;
      this.bmi = this.weight / (heightInMeters ** 2);
    }

    // Set BMI category based on result
    if (this.bmi < 18.5) {
      this.bmiCategory = 'Underweight';
    } else if (this.bmi >= 18.5 && this.bmi < 25) {
      this.bmiCategory = 'Normal';
    } else if (this.bmi >= 25 && this.bmi < 30) {
      this.bmiCategory = 'Overweight';
    } else {
      this.bmiCategory = 'Obese';
    }
  }

}
