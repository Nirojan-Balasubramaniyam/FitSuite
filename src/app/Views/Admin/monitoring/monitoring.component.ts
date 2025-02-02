import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService } from '../../../Service/Staff/admin.service';
import { WorkouplanService } from '../../../Service/Admin/Workoutplan/workouplan.service';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})
export class MonitoringComponent implements OnInit {
  members: any[] = [


    // Add more members as needed
  ];

  selectedMember: any = null;

  constructor(private AdminService: AdminService, private WorkOutplanService: WorkouplanService) {

  }
  BranchId: any;
  ngOnInit(): void {
    this.BranchId = localStorage.getItem('BranchId');
    this.loadMembers(0, 0, this.BranchId)
  }
  loadMembers(pageIndex: number = 0, pageSize: number = 0, branchId: number = this.BranchId): void {

    this.AdminService.getAllMembers(pageIndex, pageSize, true, branchId).subscribe(response => {
      this.members = response.data;
      console.log(pageIndex, pageSize)
      console.log('Loaded members:', this.members);

    });
  }

  openModal(member: any): void {
    this.selectedMember = member;
  }
  closeModal() {
    this.selectedMember = null;

  }
  startTime: any;
  endTime: any;
  Day: any;


  UpdateTime(workoutplan: number) {
    console.log(this.startTime)
    console.log(this.endTime)
    
    this.WorkOutplanService.updatePlanTime(workoutplan, this.startTime, this.endTime, this.Day).subscribe({
      next: () => {
        alert("Update Successful");
        window.location.reload()
      },
      error: (err) => {
        console.error("Update failed", err);
        alert("There was an error updating the time. Please try again.");
      }
    });
  }
}
