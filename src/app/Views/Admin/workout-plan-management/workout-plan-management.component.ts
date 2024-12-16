import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { TrainerService } from '../../../Service/Trainer/trainer.service';
import { WorkoutPlanFilterPipe } from '../../../Pipes/WorkoutPlanFilter/workout-plan-filter.pipe';
import { WorkoutPlan } from '../../../Models/workoutPlans';

@Component({
  selector: 'app-workout-plan-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule, WorkoutPlanFilterPipe],
  templateUrl: './workout-plan-management.component.html',
  styleUrl: './workout-plan-management.component.css'
})
export class WorkoutPlanManagementComponent {
  isLightTheme: boolean = true;
  workoutPlans: WorkoutPlan[] = [];
  modalRef?: BsModalRef;
  workoutPlanId: number = 0;
  name: string = "";
  workoutForm: FormGroup;
  searchText: string = '';

  @ViewChild('workoutPlanForm') workoutPlanForm!: TemplateRef<any>;

  constructor(
    private themeService: ThemeService,
    private trainerService: TrainerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.workoutForm = this.fb.group({
      name: ['', [Validators.required]],
      repsCount: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
    this.spinner.show();
    this.loadWorkoutPlans();
  }

  loadWorkoutPlans(): void {
    const pageNumber = 1;  // or any logic to get current page
    const pageSize = 10;
    
    this.trainerService.getAllWorkoutPlans(pageNumber, pageSize).subscribe(
      (response: any) => {
        console.log('API response:', response);
        
        // Check if 'data' exists in the response and is an array
        if (response && Array.isArray(response.data)) {
          this.workoutPlans = response.data; // Access the 'data' field
        } else {
          console.error('Expected an array inside "data" but received:', response);
          this.workoutPlans = [];  // Fallback to an empty array if not
        }
  
        console.log('Loaded workout plans:', this.workoutPlans);
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error loading workout plans:', error);
      }
    );
  }
  

  onSubmit(): void {
    if (this.workoutForm && this.workoutForm.valid) {
      const formData = this.workoutForm.value;

      if (this.workoutPlanId !== 0) {
        this.trainerService.updateWorkoutPlan(this.workoutPlanId, formData).subscribe(
          (response: any) => {
            this.toastr.success("Workout plan updated successfully", "Workout Plan Update", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadWorkoutPlans();
            this.workoutPlanId = 0;
            this.workoutForm.reset();
          },
          (error: any) => {
            this.toastr.error('There was an error updating the workout plan.', 'Error');
          }
        );
      } else {
        this.trainerService.addWorkoutPlan(formData).subscribe(
          (response: any) => {
            this.toastr.success("Workout plan created successfully", "Workout Plan Creation", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadWorkoutPlans();
            this.workoutForm.reset();
          },
          (error: any) => {
            this.toastr.error('There was an error creating the workout plan.', 'Error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  onEdit(workoutPlanId: number): void {
    const workoutPlan = this.workoutPlans.find(p => p.workoutPlanId === workoutPlanId);
    if (workoutPlan) {
      this.workoutPlanId = workoutPlanId;
      this.workoutForm.patchValue({
        Name: workoutPlan.name,
        RepsCount: workoutPlan.repsCount,
        Weight: workoutPlan.weight
      });
      this.openModalWithClass(this.workoutPlanForm);
    }
  }

  confirm(): void {
    this.trainerService.deleteWorkoutPlan(this.workoutPlanId).subscribe(
      (response: any) => {
        this.toastr.success("Workout Plan Deleted successfully", "Delete Workout Plan", {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr'
        });
        this.modalRef?.hide();
        this.workoutPlanId = 0;
        this.loadWorkoutPlans();
      },
      (error: any) => {
        this.toastr.error('There was an error deleting the workout plan.', 'Error');
      }
    );
    this.modalRef?.hide();
  }

  openModal(template: TemplateRef<void>, Id: number): void {
    this.workoutPlanId = Id;
    const findedWorkout = this.workoutPlans.find(p => p.workoutPlanId === Id);
    if (findedWorkout) {
      this.name = findedWorkout.name;
    }
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }

  openModalWithClass(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    this.modalRef.onHide?.subscribe(() => {
      this.workoutForm.reset();
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }

  isRequired(field: string): boolean {
    return this.workoutForm.get(field)?.hasValidator(Validators.required) ?? false;
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }
}
