import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})
export class MonitoringComponent {
  members = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      workoutPlans: [
        { name: 'Plan A', startTime: '6:00 AM', checked: false },
        { name: 'Plan B', startTime: '7:00 AM', checked: false }, 
          { name: 'Plan C', startTime: '8:00 AM', checked: false },
        { name: 'Plan D', startTime: '9:00 AM', checked: false }
      ]
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      workoutPlans: [
        { name: 'Plan C', startTime: '8:00 AM', checked: false },
        { name: 'Plan D', startTime: '9:00 AM', checked: false }
      ]
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      workoutPlans: [
        { name: 'Plan C', startTime: '8:00 AM', checked: false },
        { name: 'Plan D', startTime: '9:00 AM', checked: false }
      ]
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      workoutPlans: [
        { name: 'Plan C', startTime: '8:00 AM', checked: false },
        { name: 'Plan D', startTime: '9:00 AM', checked: false }
      ]
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      workoutPlans: [
        { name: 'Plan C', startTime: '8:00 AM', checked: false },
        { name: 'Plan D', startTime: '9:00 AM', checked: false }
      ]
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      workoutPlans: [
        { name: 'Plan C', startTime: '8:00 AM', checked: false },
        { name: 'Plan D', startTime: '9:00 AM', checked: false }
      ]
    },
    
    // Add more members as needed
  ];

  selectedMember: any = null;

  constructor() {}

  openModal(member: any): void {
    this.selectedMember = member;
  }
  closeModal() {
    this.selectedMember = null;

  }
}
