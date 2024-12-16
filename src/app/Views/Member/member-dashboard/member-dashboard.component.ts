import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../../Models/member';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { WorkoutPlan } from '../../../Models/workoutPlans';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { WorkouplanService } from '../../../Service/Admin/Workoutplan/workouplan.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ThemeService } from '../../../Service/Theme/theme.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './member-dashboard.component.html',
  styleUrl: './member-dashboard.component.css'
})
export class MemberDashboardComponent implements OnInit {
  
  isLightTheme: boolean = true;
  isNavbarVisible: boolean = true;
  memberId!: number;
  member: Member | null = null;
  trainingPrograms: TrainingProgram[] = [];
  groupedTrainingPrograms: { typeName: string; programs: TrainingProgram[] }[] =
    [];
  modalRef?: BsModalRef;
  workoutPlans: WorkoutPlan[] = [
    {
      workoutPlanId: 1,
      name: 'Strength Training',
      repsCount: 12,
      weight: 50.5,
      staffId: 101,
    },
    {
      workoutPlanId: 2,
      name: 'Cardio Blast',
      repsCount: 30,
      weight: 0, // No weight used in this plan
      staffId: 102,
    },
    {
      workoutPlanId: 3,
      name: 'Leg Day Routine',
      repsCount: 15,
      weight: 70.0,
      staffId: 103,
    },
    {
      workoutPlanId: 4,
      name: 'Full Body Workout',
      repsCount: 20,
      weight: 40.0,
      staffId: 101,
    },
    {
      workoutPlanId: 5,
      name: 'Core Strengthening',
      repsCount: 20,
      weight: 30.0,
      staffId: 104,
    },
  ];



constructor(
  private themeService: ThemeService,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private enrollProgramService: EnrollProgramService,
    private workoutPlanService: WorkouplanService
  ) {
    const memberId = localStorage.getItem('UserId');

    this.memberId = memberId ? parseInt(memberId) : 0;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadMember();
  }

  loadMember(): void {
    this.adminService.getMember(this.memberId).subscribe((response) => {
      this.member = response;
      console.log(this.member.imagePath);

      this.spinner.hide();
    });
  }

  loadTrainingPrograms(): void {
    this.enrollProgramService
      .getTrainingProgramsByMemberId(this.memberId)
      .subscribe((programs: TrainingProgram[]) => {
        this.trainingPrograms = programs;
        this.groupProgramsByType();
        this.spinner.hide();
      });
  }

  loadWorkoutPlans(): void {
    this.workoutPlanService
      .getWorkoutplansForMember(this.memberId)
      .subscribe((workoutPlans: WorkoutPlan[]) => {
        this.workoutPlans = workoutPlans;
        this.spinner.hide();
      });
  }


  groupProgramsByType(): void {
    const grouped: Record<string, TrainingProgram[]> = {}; // Correct type here

    this.trainingPrograms.forEach((program) => {
      const typeName = program.typeName || 'Uncategorized'; // Default group if no typeName
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(program);
    });

    // Convert grouped object into an array format for use in the template
    this.groupedTrainingPrograms = Object.keys(grouped).map((typeName) => ({
      typeName,
      programs: grouped[typeName],
    }));
  }
  groupWorkoutsByName(): void {
    const grouped: Record<string, TrainingProgram[]> = {}; // Correct type here

    this.trainingPrograms.forEach((program) => {
      const typeName = program.typeName || 'Uncategorized'; // Default group if no typeName
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(program);
    });

    // Convert grouped object into an array format for use in the template
    this.groupedTrainingPrograms = Object.keys(grouped).map((typeName) => ({
      typeName,
      programs: grouped[typeName],
    }));
  }

  


}
