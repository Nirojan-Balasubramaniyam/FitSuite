import { Component, signal, ViewChild, TemplateRef } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import zxcvbn from 'zxcvbn';
import { merge } from 'rxjs';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';


import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { Staff } from '../../../Models/staff';
import { MemberFilterPipe } from '../../../Pipes/MemberFilter/member-filter.pipe';
import { StaffFilterPipe } from '../../../Pipes/Staff-Filter/staff-filter.pipe';
import { Branch } from '../../../Models/branch';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, BsDatepickerModule, PasswordStrengthMeterComponent, MatPaginatorModule, StaffFilterPipe, NgxSpinnerModule],

  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.css'
})
export class StaffManagementComponent {
  isLightTheme: boolean = true;
  staffForm: FormGroup;
  modalRef?: BsModalRef;
  passwordStrength: string | null = null;
  branchId: number = 1;
  staffId: number = 0;
  staffName:string="";
  searchText: string = '';
  fullImgPath: string = "https://localhost:7220";
  @ViewChild('staffFormTemplate') staffFormTemplate!: TemplateRef<any>;


  staffs: Staff[] = [];  // staffs for the current page
  allstaffs: Staff[] = [];
  totalRecords: number = 0;  // Total number of records
  pageSize: number = 6;  // Records per page
  pageIndex: number = 0;
    userRole:string='';
    branches: Branch[] = [];

  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService) {

      const role = localStorage.getItem('Role') || '';
      const branchId = localStorage.getItem('BranchId');
  
      this.userRole = role;
      this.branchId = branchId ? parseInt(branchId) : 0;

    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      NIC: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      useRole: ['', Validators.required],
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

  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });

    this.loadstaffs();
    this.spinner.show();


    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }


  // Fetch staffs with pagination params (pageIndex and pageSize)
  loadstaffs(pageIndex: number = 1, pageSize: number = 6, branchId: number = this.branchId): void {
    this.adminService.getAllStaffs(0, 0, true).subscribe(response => {
      this.staffs = response.data;
      this.totalRecords = response.totalRecords;
      console.log(pageIndex, pageSize)
      console.log('Loaded staffs:', this.staffs);
      this.spinner.hide();

    });
  }

  // Handle page change event from the paginator
  onPageChange(event: any): void {
    const pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    // Fetch data with the correct page number and page size
    this.loadstaffs(pageIndex, this.pageSize);
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

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.staffForm.patchValue({
        imageFile: file
      });
    }
  }


  onSubmit(): void {
    if (this.staffForm.valid) {
      const formData = new FormData();
      const formattedDoB = this.datePipe.transform(this.staffForm.get('doB')?.value, 'yyyy-MM-dd');

      if (formattedDoB) {
        formData.append('DoB', formattedDoB);
      } else {
        formData.append('DoB', '');
      }

      // Append form control values
      formData.append('FirstName', this.staffForm.get('firstName')?.value);
      formData.append('LastName', this.staffForm.get('lastName')?.value);
      formData.append('Email', this.staffForm.get('email')?.value);
      formData.append('NIC', this.staffForm.get('NIC')?.value);
      formData.append('Phone', this.staffForm.get('phone')?.value);
      formData.append('EmergencyContactName', this.staffForm.get('emergencyContactName')?.value);
      formData.append('EmergencyContactNumber', this.staffForm.get('emergencyContactNumber')?.value);
      formData.append('BranchId', this.branchId.toString());  
      formData.append('Password', this.staffForm.get('phone')?.value); 
      formData.append('UserRole', this.staffForm.get('phone')?.value); 
      formData.append('IsActive', "true");
      formData.append('Gender', "male");

      // Append address fields
      const address = this.staffForm.get('address')?.value;
      formData.append('Address.Street', address?.street || '');
      formData.append('Address.City', address?.city || '');
      formData.append('Address.Province', address?.province || '');
      formData.append('Address.Country', address?.country || '');

      // Append profile image
      const imageFile = this.staffForm.get('imageFile')?.value;
      if (imageFile) {
        formData.append('ImageFile', imageFile, imageFile.name);
      }

      if (this.staffId != 0) {
        // If staffId exists, update the staff
        this.adminService.updateStaff(this.staffId, formData).subscribe(
          (response) => {
            console.log('staff updated successfully', response);
            this.toastr.success("staff updated successfully", "staff Update", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadstaffs();
            this.staffId = 0;
            this.staffForm.reset();
          },
          error => {
            console.log('Error updating staff', error);
            this.toastr.error('There was an error updating the staff.', 'Error');
          }
        );
      } else {
        // If no staffId, create a new staff
        this.adminService.addStaff(formData).subscribe(
          (response: string) => {
            console.log('staff created successfully, token:', response);
            this.toastr.success("staff created successfully", "staff Creation", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadstaffs();
          },
          error => {
            console.log('Error creating staff', error);
            this.toastr.error('There was an error creating the staff.', 'Error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }


  editstaff(staffId: number): void {
    const staff = this.staffs.find(m => m.staffId === staffId);
    if (staff) {
      this.staffId = staffId; // Set staffId for updating

      const formattedDate = staff.doB ? new Date(staff.doB) : null;

      this.staffForm.patchValue({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        NIC: staff.nic,
        phone: staff.phone,
        doB: formattedDate,
        branchId: staff.branchId,
        isActive: staff.isActive,
        address: {
          street: staff.address?.street || '',
          city: staff.address?.city || '',
          province: staff.address?.province || '',
          country: staff.address?.country || ''
        }
      });
      this.openModalWithClass(this.staffFormTemplate); // Open modal with pre-filled data
    }
  }


  isRequired(field: string): boolean {
    return this.staffForm.get(field)?.hasValidator(Validators.required) ?? false;
  }

  decline() {
    this.modalRef?.hide();
  }

  confirm() {
    this.adminService.deleteStaff(this.staffId).subscribe(
      (response) => {

        this.toastr.success("staff Deleted successfully", "Delete staff", {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr'
        });
        this.modalRef?.hide();
        this.staffId = 0;
        this.loadstaffs();
      },
      error => {
        console.log('Error creating staff', error);
        this.toastr.error('There was an error delete the staff.', 'Error');
      }
    );
    this.modalRef?.hide();
  }

  openModalWithClass(template: TemplateRef<void>) {
    console.log(this.staffId)
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));

    this.modalRef.onHide?.subscribe(() => {
      this.staffForm.reset();
      // Reset form when modal is closed
    });
  }

  openModal(template: TemplateRef<void>, Id: number) {
    this.staffId = Id;
    const findedstaff = this.staffs.find(m => m.staffId === Id);
    if(findedstaff){
      this.staffName = findedstaff.firstName +" "+ findedstaff.lastName
    }

    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'modal-md' }) );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }


}
