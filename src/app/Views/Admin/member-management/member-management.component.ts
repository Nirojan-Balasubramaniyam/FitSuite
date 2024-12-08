import { Component, signal, TemplateRef } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import zxcvbn from 'zxcvbn'; 
import {merge} from 'rxjs';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { Member } from '../../../Models/member';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,BsDatepickerModule, PasswordStrengthMeterComponent, MatPaginatorModule],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.css'
})
export class MemberManagementComponent {
  isLightTheme: boolean = true;
  memberForm: FormGroup;
  modalRef?: BsModalRef;
  passwordStrength: string | null = null;
  branchId:number =1;

  members: Member[] = [];  // Members for the current page
  totalRecords: number = 0;  // Total number of records
  pageSize: number = 7;  // Records per page
  pageIndex: number = 1;

  constructor(private themeService: ThemeService, private adminService : AdminService, private fb: FormBuilder, private modalService: BsModalService, private toastr : ToastrService, private datePipe: DatePipe) {
    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      NIC: ['', [Validators.required,   Validators.pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/) ]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      doB: ['', [Validators.required, this.pastDateValidator]],
      branchId: [null],
      isActive: [true],
      imageFile: [null],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        country: ['', Validators.required]
      })
    });

  }

  isRequired(field: string): boolean {
    return this.memberForm.get(field)?.hasValidator(Validators.required) ?? false;
  }


  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });

    this.loadMembers();
  }

   // Fetch members with pagination params (pageIndex and pageSize)
   loadMembers(pageIndex: number = 1, pageSize: number = 7): void {
    this.adminService.getAllMembers(pageIndex, pageSize).subscribe(response => {
      this.members = response.data;  // Data for the current page
      this.totalRecords = response.totalRecords;  // Total records for pagination
      console.log(pageIndex,pageSize)
      console.log('Loaded members:', this.members);
    });
  }

    // Handle page change event from the paginator
    onPageChange(event: any): void {
      const pageIndex = event.pageIndex +1;  // This is zero-based
      this.pageSize = event.pageSize;     // Page size
    
      // Fetch data with the correct page number and page size
      this.loadMembers(pageIndex, this.pageSize);
    }

  // loadMembers(pageIndex: number = 0, pageSize: number = 7): void {
  //   // Fetch the members from your service (assuming pagination params are needed)
  //   this.adminService.getAllMembers(pageIndex, pageSize).subscribe(response => {
  //     this.members = response.data;  
  //     this.totalRecords = response.totalRecords;
  //     this.paginatedMembers = this.members;
  //   });
  // }


  // Method to slice the data based on current page
  // paginateMembers(pageIndex: number, pageSize: number): void {
  //   const startIndex = pageIndex * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   this.paginatedMembers = this.members.slice(startIndex, endIndex);
  // }


  // Handle page change event from the paginator
  // onPageChange(event: any): void {
  //   this.pageIndex = event.pageIndex;  
  //   this.pageSize = event.pageSize;    
  //   this.loadMembers(this.pageIndex, this.pageSize);  
  // }

  editMember(member: any): void {
    console.log('Editing member:', member);
    // Implement your edit logic
  }

  deleteMember(member: any): void {
    console.log('Deleting member:', member);
    // Implement your delete logic
  }


  openModalWithClass(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }

  // validator to ensure that the date of birth is in the past
  pastDateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    const birthDate = new Date(control.value);
    if (birthDate >= today) {
      return { 'futureDate': true };
    }
    return null;
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      const file = fileInput.files[0];
      this.memberForm.patchValue({
        imageFile: file
      });
    }
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      const formData = new FormData();
      const formattedDoB = this.datePipe.transform(this.memberForm.get('doB')?.value, 'yyyy-MM-dd');
  
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
      formData.append('EmergencyContactName', this.memberForm.get('emergencyContactName')?.value);
      formData.append('EmergencyContactNumber', this.memberForm.get('emergencyContactNumber')?.value);
      formData.append('BranchId', "1");
      formData.append('Password',  this.memberForm.get('phone')?.value);
      formData.append('IsActive', "true");
      formData.append('Gender', "male");
  
      // Append address fields
      const address = this.memberForm.get('address')?.value;
      formData.append('Address.Street', address?.street || '');
      formData.append('Address.City', address?.city || '');
      formData.append('Address.Province', address?.province || '');
      formData.append('Address.Country', address?.country || '');
  
      const imageFile = this.memberForm.get('imageFile')?.value;
      if (imageFile) {
        formData.append('ProfileImage', imageFile, imageFile.name); // The third parameter is the filename
      }
  
      this.adminService.createMember(formData).subscribe(
        (response: string) => {
          console.log('Member created successfully, token:', response);
          this.toastr.success("Member created successfully", "Member Creation", {
            timeOut: 5000,
            closeButton: true,
            easing: 'ease-in',
            progressBar: true,
            toastClass: 'ngx-toastr'
          });
          this.modalRef?.hide()
          this.loadMembers();
        },
        error => {
          console.log('Error creating member', error);
          this.toastr.error('There was an error creating the member.', 'Error');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
  

}
