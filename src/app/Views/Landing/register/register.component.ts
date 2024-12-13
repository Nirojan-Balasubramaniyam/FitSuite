import { CommonModule, DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Member } from '../../../Models/member';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Branch } from '../../../Models/branch';
import { PaginationResponse } from '../../../Models/pagination';
import { Observable, of } from 'rxjs';
import { ApprovalRequestService } from '../../../Service/Admin/Request/approval-request.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    BsDatepickerModule,
    PasswordStrengthMeterComponent,
    NgxSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLightTheme: boolean = true;
  memberForm: FormGroup;
  passwordStrength: string = '';
  password: string = '';
  branches: Branch[] = [];

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  @ViewChild('memberFormTemplate') memberFormTemplate!: TemplateRef<any>;
  allMembers: Member[] = [];

  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private approvalRequestServiceService: ApprovalRequestService
  ) {
    this.memberForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailExists.bind(this)],
        ],
        NIC: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/),
          ],
        ],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
          [this.nicExists.bind(this)],
        ],
        emergencyContactName: ['', Validators.required],
        emergencyContactNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        doB: ['', [Validators.required, this.pastDateValidator]],
        paymentReceipt: ['', Validators.required],
        gender: ['', Validators.required],
        branchId: ['', Validators.required],
        isActive: [true],
        imageFile: [null],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/), // One uppercase and one symbol
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          district: ['', Validators.required],
          province: ['', Validators.required],
          country: ['', Validators.required],
        }),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });

    this.spinner.show();
    this.loadMembers();
    this.loadBranches();
  }

  loadMembers(): void {
    this.adminService.getAllMembers(0, 0, true, 0).subscribe((response) => {
      this.allMembers = response.data;
      this.spinner.hide();
    });
  }

  loadBranches(): void {
    this.adminService
      .getAllBranches()
      .subscribe((response: PaginationResponse<Branch>) => {
        // Filter branches to only include active ones (isActive = true)
        this.branches = response.data.filter((branch) => branch.isActive);
        this.spinner.hide();
      });
  }

  pastDateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    const birthDate = new Date(control.value);
    if (birthDate >= today) {
      return { futureDate: true };
    }
    return null;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    console.log("onfile")
    if (file) {
    console.log("onfile-after")

      this.memberForm.patchValue({
        imageFile: file,
      });
    }
  }

  onSubmit(): void {
    console.log("gg",this.memberForm.value)
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
      formData.append('BranchId', this.memberForm.get('branchId')?.value);
      formData.append('Password', this.memberForm.get('phone')?.value);
      formData.append('IsActive', 'true');
      formData.append('Gender', this.memberForm.get('gender')?.value);
      formData.append('PaymentReceipt', this.memberForm.get('paymentReceipt')?.value);

      // Append address fields
      const address = this.memberForm.get('address')?.value;
      formData.append('Address.Street', address?.street || '');
      formData.append('Address.City', address?.city || '');
      formData.append('Address.Province', address?.province || '');
      formData.append('Address.District', address?.district || '');
      formData.append('Address.Country', address?.country || '');

      // Append profile image
      const imageFile = this.memberForm.get('imageFile')?.value;
      if (imageFile) {
    console.log("image-append")

        formData.append('ImageFile', imageFile, imageFile.name);
      }

      this.approvalRequestServiceService
        .createAddMemberRequest(formData)
        .subscribe(
         
          (response) => {
            console.log("formdata",formData)
            this.toastr.success(
              'Member Registration send to Admin Approval, You notify by Your Email',
              'Member Registration',
              {
                timeOut: 5000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr',
              }
            );
            this.memberForm.reset();
          },
          (error) => {
            console.log('Error requesting member', error);
            this.toastr.error(
              'There was an error Registering the member.',
              'Error'
            );
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

  isRequired(field: string): boolean {
    return (
      this.memberForm.get(field)?.hasValidator(Validators.required) ?? false
    );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }

  // Method to check if the email exists in the allMembers array
  emailExists(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    if (!email) {
      return of(null);
    }

    const emailExists = this.allMembers.some(
      (member) => member.email.toLowerCase() === email.toLowerCase()
    );
    return of(emailExists ? { emailExists: true } : null);
  }

  // Method to check if the NIC exists in the allMembers array
  nicExists(control: AbstractControl): Observable<ValidationErrors | null> {
    const nic = control.value;
    if (!nic) {
      return of(null);
    }

    const nicExists = this.allMembers.some((member) => member.nic === nic);
    return of(nicExists ? { nicExists: true } : null);
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
}
