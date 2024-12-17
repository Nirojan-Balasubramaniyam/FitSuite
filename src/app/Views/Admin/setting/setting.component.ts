import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { WorkoutPlan } from '../../../Models/workoutPlans';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { TrainerService } from '../../../Service/Trainer/trainer.service';
import { Discount, DiscountReq } from '../../../Models/discount';
import { DiscountService } from '../../../Service/Admin/Discount/discount.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../Service/Staff/admin.service';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    PasswordStrengthMeterComponent,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  isLightTheme: boolean = true;
  discounts: Discount[] = [];
  modalRef?: BsModalRef;
  discountId: number = 0;
  name: string = '';
  discountForm: FormGroup;
  searchText: string = '';
  setDiscount: boolean = false;
  branchId: number = 1;
  userRole: string = '';
  staffId!: number;
  currentPassword!: string;
  newPassword!: string;
  passwordMatch: boolean = false;
  memberForm: FormGroup;
  passwordStrength: string = '';
  password: string = '';
  oldPassword!: string;
  oldPasswordDiv: boolean = false;

  @ViewChild('discountFormModal') discountFormModal!: TemplateRef<any>;

  constructor(
    private themeService: ThemeService,
    private discountService: DiscountService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private admminService: AdminService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    const role = localStorage.getItem('Role') || '';
    const branchId = localStorage.getItem('BranchId');
    const staffId = localStorage.getItem('UserId');

    this.userRole = role;
    this.branchId = branchId ? parseInt(branchId) : 0;
    this.staffId = staffId ? parseInt(staffId) : 0;

    this.discountForm = this.fb.group({
      name: ['', [Validators.required]],
      discount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });

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
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
    this.spinner.show();
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    this.discountService.getAllDiscounts().subscribe((response) => {
      this.discounts = response;
    });
  }

  onSubmit(): void {
    if (this.discountForm && this.discountForm.valid) {
      const formData = this.discountForm.value;
      const month = this.discountForm.get('name')?.value;
      const discount = this.discountForm.get('discount')?.value;
      const monthName = month + 'Month';
      const newDiscount: DiscountReq = {
        name: monthName,
        discount: discount,
      };

      if (this.discountId !== 0) {
        this.discountService
          .updateDiscount(this.discountId, newDiscount)
          .subscribe(
            (response: any) => {
              this.toastr.success(
                'Discount updated successfully',
                'Discount Update',
                {
                  timeOut: 5000,
                  closeButton: true,
                  easing: 'ease-in',
                  progressBar: true,
                  toastClass: 'ngx-toastr',
                }
              );
              this.modalRef?.hide();
              this.loadDiscounts();
              this.discountId = 0;
              this.discountForm.reset();
            },
            (error: any) => {
              this.toastr.error(
                'There was an error updating the discount.',
                'Error'
              );
            }
          );
      } else {
        this.discountService.createDiscount(newDiscount).subscribe(
          (response: any) => {
            this.toastr.success(
              'Discount created successfully',
              'Discount Creation',
              {
                timeOut: 5000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr',
              }
            );
            this.modalRef?.hide();
            this.loadDiscounts();
            this.discountForm.reset();
          },
          (error: any) => {
            this.toastr.error(
              'There was an error creating the discount.',
              'Error'
            );
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  onEdit(discountId: number): void {
    const discount = this.discounts.find((d) => d.discountId === discountId);
    if (discount) {
      this.discountId = discountId;
      this.discountForm.patchValue({
        name: parseInt(discount.name),
        discount: discount.discount,
      });
      this.openModalWithClass(this.discountFormModal);
    }
  }

  toggleDiscount(): void {
    this.setDiscount = !this.setDiscount;
  }

  togglePassword(): void {
    this.oldPasswordDiv = !this.oldPasswordDiv;
  }

  confirm(): void {
    this.discountService.deleteDiscount(this.discountId).subscribe(
      (response: any) => {
        this.toastr.success(
          'Discount Deleted successfully',
          'Delete Discount',
          {
            timeOut: 3000,
            closeButton: true,
            easing: 'ease-in',
            progressBar: true,
            toastClass: 'ngx-toastr',
          }
        );
        this.modalRef?.hide();
        this.discountId = 0;
        this.loadDiscounts();
      },
      (error: any) => {
        this.toastr.error('There was an error deleting the discount.', 'Error');
      }
    );
    this.modalRef?.hide();
  }

  openModal(template: TemplateRef<void>, Id: number): void {
    this.discountId = Id;
    const foundDiscount = this.discounts.find((d) => d.discountId === Id);
    if (foundDiscount) {
      this.name = foundDiscount.name;
    }
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md' })
    );
  }

  openModalWithClass(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.modalRef.onHide?.subscribe(() => {
      this.discountForm.reset();
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }

  isRequired(field: string): boolean {
    return (
      this.discountForm.get(field)?.hasValidator(Validators.required) ?? false
    );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }

  checkPassword(): void {
    this.admminService
      .checkStaffPassword(this.staffId, this.oldPassword)
      .subscribe((response) => {
        if (response) {
          this.passwordMatch = true;
        }
      });
  }

  updatePassword(): void {
    this.admminService
      .updateStaffPassword(this.staffId, this.newPassword)
      .subscribe(
        (response) => {
          this.toastr.success(
            'Password Updated successfully',
            'Password Updated',
            {
              timeOut: 3000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr',
            }
          );
          this.passwordMatch = false;
        },
        (error: any) => {
          this.toastr.error(
            'There was an error Updating Staff Password.',
            'Error'
          );
        }
      );
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

  onPasswordSubmit(): void {
    if (this.memberForm.valid) {
      const formData = new FormData();

      const password = this.memberForm.get('password')?.value;

      this.admminService.checkStaffPassword(this.staffId, password).subscribe(
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
}
