import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../Service/Staff/admin.service';
import { Member } from '../../../Models/member';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { WorkouplanService } from '../../../Service/Admin/Workoutplan/workouplan.service';
import { WorkoutPlan } from '../../../Models/workoutPlans';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  isLightTheme: boolean = true;
  isNavbarVisible: boolean = true;
  memberId!: number;
  member: Member | null = null;
  // allMembers: Member[] = [];
  fullImgPath: string ="";
  // workoutPlans: WorkoutPlan[] = [
  //   {
  //     workOutPlanId: 1,
  //     name: 'Strength Training',
  //     repsCount: 12,
  //     weight: 50.5,
  //     staffId: 101,
  //   },
  //   {
  //     workoutPlanId: 2,
  //     name: 'Cardio Blast',
  //     repsCount: 30,
  //     weight: 0, // No weight used in this plan
  //     staffId: 102,
  //   },
  //   {
  //     workoutPlanId: 3,
  //     name: 'Leg Day Routine',
  //     repsCount: 15,
  //     weight: 70.0,
  //     staffId: 103,
  //   },
  //   {
  //     workoutPlanId: 4,
  //     name: 'Full Body Workout',
  //     repsCount: 20,
  //     weight: 40.0,
  //     staffId: 101,
  //   },
  //   {
  //     workoutPlanId: 5,
  //     name: 'Core Strengthening',
  //     repsCount: 20,
  //     weight: 30.0,
  //     staffId: 104,
  //   },
  // ];
  trainingPrograms: TrainingProgram[] = [];
  groupedTrainingPrograms: { typeName: string; programs: TrainingProgram[] }[] =
    [];
  modalRef?: BsModalRef;
  memberForm: FormGroup;


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

    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      NIC: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      doB: ['', [Validators.required, this.pastDateValidator]],
      imageFile: [null],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });

    this.patchMember();


  }

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });

    this.themeService.isNavbarVisible$.subscribe((isVisible) => {
      this.isNavbarVisible = isVisible;
    });
    this.spinner.show();
    this.loadMember();
  }

  loadMember(): void {
    this.adminService.getMember(this.memberId).subscribe((response) => {
      this.member = response;
      console.log(this.member);
      console.log('member address:', this.member.address);
      this.patchMember();

      this.spinner.hide();
    });
  }

  
  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.memberForm.patchValue({
        imageFile: file,
      });
    }
  }

  patchMember(): void {
    // const member = this.allMembers.find((m) => m.memberId === this.memberId);
    const member = this.member;
    console.log("patch")
    if (member) {
      console.log("ff")
      console.log('member hh address:', member.address);

      const formattedDate = member.doB ? new Date(member.doB) : null;

      this.memberForm.patchValue({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        NIC: member.nic,
        phone: member.phone,
        emergencyContactName: member.emergencyContactName,
        emergencyContactNumber: member.emergencyContactNumber,
        doB: formattedDate,
        branchId: member.branchId,
        isActive: member.isActive,
        address: {
          street: member.address?.street || '',
          city: member.address?.city || '',
          province: member.address?.province || '',
          country: member.address?.country || '',
        },
      });
          }
  }

  decline() {
    this.modalRef?.hide();
  }

  isRequired(field: string): boolean {
    return (
      this.memberForm.get(field)?.hasValidator(Validators.required) ?? false
    );
  }

  



  confirm() {
    this.adminService.deleteMember(this.memberId).subscribe(
      (response) => {
        this.toastr.success('Member Deleted successfully', 'Delete Member', {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr',
        });
        this.modalRef?.hide();
        this.memberId = 0;
        // this.loadAllMembers();
      },
      (error) => {
        console.log('Error creating member', error);
        this.toastr.error('There was an error delete the member.', 'Error');
      }
    );
    this.modalRef?.hide();
  }

  pastDateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    const birthDate = new Date(control.value);
    if (birthDate >= today) {
      return { futureDate: true };
    }
    return null;
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      const formData = new FormData();
      const formattedDoB = this.datePipe.transform(
        this.memberForm.get('doB')?.value,
        'yyyy-MM-dd'
      );

      if (formattedDoB) {
        formData.append('DoB', formattedDoB);
      } else {
        formData.append('DoB', '');
      }

      // Append form control values
      formData.append('FirstName', this.memberForm.get('firstName')?.value);
      formData.append('LastName', this.memberForm.get('lastName')?.value);
      formData.append('Email', this.memberForm.get('email')?.value);
      formData.append('NIC', this.memberForm.get('NIC')?.value);
      formData.append('Phone', this.memberForm.get('phone')?.value);
      formData.append(
        'EmergencyContactName',
        this.memberForm.get('emergencyContactName')?.value
      );
      formData.append(
        'EmergencyContactNumber',
        this.memberForm.get('emergencyContactNumber')?.value
      );
    
      formData.append('IsActive', 'true');
      formData.append('Gender', 'male');

      // Append address fields
      const address = this.memberForm.get('address')?.value;
      console.log('update Address:', address);
      formData.append('Address.Street', address?.street || '');
      formData.append('Address.City', address?.city || '');
      formData.append('Address.Province', address?.province || '');
      formData.append('Address.Country', address?.country || '');

      // Append profile image
      const imageFile = this.memberForm.get('imageFile')?.value;
      if (imageFile) {
        formData.append('ImageFile', imageFile, imageFile.name);
      }

      if (this.memberId != 0) {
        // If memberId exists, update the member
        this.adminService.updateMember(this.memberId, formData).subscribe(
          (response) => {
            console.log(' successfully', response);
            this.toastr.success(
              'Member updated successfully',
              'Member Update',
              {
                timeOut: 5000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr',
              }
            );
            this.modalRef?.hide();
            this.memberId = 0;
            //this.memberForm.reset();
          },
          (error) => {
            console.log('Error updating member', error);
            this.toastr.error(
              'There was an error updating the member.',
              'Error'
            );
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }


 
}
