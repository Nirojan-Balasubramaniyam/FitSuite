import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { MemberService } from '../../../Service/Member/member.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    PasswordStrengthMeterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './member-dashboard.component.html',
  styleUrl: './member-dashboard.component.css',
})
export class MemberDashboardComponent implements OnInit {
  isLightTheme: boolean = true;
  isNavbarVisible: boolean = true;
  memberId!: number;
  member: Member | null = null;
  trainingPrograms: TrainingProgram[] = [];
  groupedTrainingPrograms: { typeName: string; programs: TrainingProgram[] }[] =
    [];
  memberForm: FormGroup;
  passwordStrength: string = '';
  password: string = '';
  modalRef?: BsModalRef;
  workoutPlans: WorkoutPlan[] = [];
  @ViewChild('passwordUpdateTemplate')
  passwordUpdateTemplate!: TemplateRef<any>;

  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private memberService: MemberService,
    private enrollProgramService: EnrollProgramService,
    private workoutPlanService: WorkouplanService
  ) {
    const memberId = localStorage.getItem('UserId');

    this.memberId = memberId ? parseInt(memberId) : 0;

    this.memberForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/), // One uppercase and one symbol
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadMember();
    this.checkPassword();
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

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  // Update the password value on input
  onPasswordInput() {
    this.password = this.memberForm.get('password')?.value;
    this.passwordStrength = this.calculateStrength(this.password);
  }

  calculateStrength(password: string): string {
    let strength = '';
    if (password.length < 8) {
      strength = 'Weak';
    } else if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      strength = 'Strong';
    } else {
      strength = 'Moderate';
    }
    return strength;
  }

  isRequired(field: string): boolean {
    return (
      this.memberForm.get(field)?.hasValidator(Validators.required) ?? false
    );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }

  checkPassword(): void {
    this.memberService
      .checkMemberPassword(this.memberId)
      .subscribe((response) => {
        if (response) {
          this.openModal(this.passwordUpdateTemplate);
        }
      });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      const formData = new FormData();

      const password = this.memberForm.get('password')?.value;

      this.adminService.updateMemberPassword(this.memberId, password).subscribe(
        (response) => {
          console.log('formdata', formData);
          this.toastr.success(
            'Password Updated Successfully',
            'Password Update',
            {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr',
            }
          );
          this.memberForm.reset();
          this.modalRef?.hide();
        },
        (error) => {
          console.log('Error requesting member', error);
          this.toastr.error('There was an error Updating password.', 'Error');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md' })
    );
  }
}
