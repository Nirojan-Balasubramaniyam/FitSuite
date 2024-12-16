import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginRegisterService } from '../../../Service/LoginRegister/login-register.service';
import { CommonModule } from '@angular/common';
import { Login } from '../../../Models/Login';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from '../../../Service/Staff/admin.service';
import { Member } from '../../../Models/member';
import { MailService } from '../../../Service/Admin/MailService/mail.service';
import { SendMailRequest } from '../../../Models/sendMailRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;

  loginData!: Login;
  modalRef?: BsModalRef;
  currentMember!: Member;
  allMembers: Member[] = [];
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  enteredOtp: string = '';
  nicNumber: string = '';
  emailPlaceholder: string = '';
  step: number = 1;
  generatedOtp: string = '';
  forgotPasswordForm: FormGroup;

  @ViewChild('memberFormTemplate') memberFormTemplate!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private registerService: LoginRegisterService,
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private mailService: MailService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.forgotPasswordForm = this.fb.group({
      nic: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    //this.spinner.show();
    //this.loadMembers();
  }

  ngLogin() {
    this.loginData = this.signinForm.value;
    console.log(this.loginData);

    this.registerService.UserLogin(this.loginData).subscribe({
      next: (response: any) => {
        // Save token and user info to localStorage
        localStorage.setItem('Token', response);
        const decoded: any = jwtDecode(response);
        localStorage.setItem('Name', decoded.FullName);
        localStorage.setItem('Role', decoded.UserRole);
        localStorage.setItem('UserId', decoded.UserId);
        localStorage.setItem('BranchId', decoded.BranchId);

        // Display success message
        this.toastr.success('User Login Successfully..', '', {
          positionClass: 'toast-top-right',
          progressBar: true,
          timeOut: 4000,
        });

        // Navigate based on user role
        this.registerService.isLoggedIn(); // Ensure that user info is updated
        const role = localStorage.getItem('Role');

        if (
          role?.toLowerCase() === '0' ||
          role?.toLowerCase() === '1'
        ) {
          this.router.navigate(['/admin/dashboard']);
        } else if (role?.toLowerCase() === 'member') {
          this.router.navigate(['/member/dashboard']);
        }
      },
      error: (error: any) => {
        this.toastr.warning(error.error, '', {
          positionClass: 'toast-top-right',
          progressBar: true,
          timeOut: 4000,
        });
      },
    });
  }

  decodeJwtToken(token: string): any {
    throw new Error('Function not implemented.');
  }

  loadMembers(): void {
    this.adminService.getAllMembers(0, 0, true, 0).subscribe((response) => {
      this.allMembers = response.data;
      console.log(this.allMembers);
      console.log('ff');
      this.spinner.hide();
    });
  }

  openModalWithClass(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );

    this.modalRef.onHide?.subscribe(() => {
      this.step=1;
      this.forgotPasswordForm.reset();
      // Reset form when modal is closed
    });
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  onSubmit(): void {
    if (this.newPassword === this.confirmPassword) {
 
      const newPassword =  this.forgotPasswordForm.get('newPassword')?.value || '';

      this.adminService
        .updateMemberPassword(this.currentMember?.memberId ?? 0, newPassword)
        .subscribe({
          next: (response) => {
            this.toastr.success('Password updated successfully.', '', {
              positionClass: 'toast-top-right',
              progressBar: true,
              timeOut: 4000,
            });
            this.modalRef?.hide(); // Close the modal
          },
          error: (error) => {
            this.toastr.error('Failed to update the password.', 'Error', {
              positionClass: 'toast-top-right',
              progressBar: true,
              timeOut: 4000,
            });
          },
        });
    } else {
      this.toastr.error('Passwords do not match. Please try again.', 'Error', {
        positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 4000,
      });
    }
  }

  onNicSubmit() {
    const member = this.allMembers.find(
      (m) => m.nic === this.forgotPasswordForm.value.nic
    );
    if (member) {
      this.currentMember = member;
      this.emailPlaceholder = this.generateEmailPlaceholder(member.email);
      console.log(member.email);
      console.log(this.emailPlaceholder);
      this.step = 2; // Move to next step (email input)
    } else {
      this.toastr.error('No member found with this NIC.');
    }
  }

  generateEmailPlaceholder(email: string): string {
    return email.replace(/^(.{3})(.*)(@.*)$/, (match, p1, p2, p3) => {
      return `${p1}${'*'.repeat(p2.length)}${p3}`;
    });
  }

  onEmailSubmit() {
    if (this.forgotPasswordForm.value.email === this.currentMember?.email) {
      this.generatedOtp = this.generateOtp();

      const sendMailRequest: SendMailRequest = {
        name: 'FIT or FIGHT',
        otp: this.generatedOtp,
        email: 'nirojan.baala@gmail.com',
        emailType: 1, 
      };
      this.mailService.sendMail(sendMailRequest).subscribe({});

      console.log(this.generatedOtp);
      this.step = 3; // Move to OTP step
    } else {
      this.toastr.error('Email does not match.');
    }
  }

  onOtpSubmit() {
    if (this.forgotPasswordForm.value.otp === this.generatedOtp) {
      this.step = 4; // Move to password change step
    } else {
      this.toastr.error('Incorrect OTP.');
    }
  }
}
