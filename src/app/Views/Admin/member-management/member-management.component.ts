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
import { Member } from '../../../Models/member';
import { MemberFilterPipe } from "../../../Pipes/MemberFilter/member-filter.pipe";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { Branch } from '../../../Models/branch';
import { PaginationResponse } from '../../../Models/pagination';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgSelectModule, MatFormFieldModule, MatInputModule, BsDatepickerModule, MatPaginatorModule, MemberFilterPipe, NgxSpinnerModule],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.css'
})
export class MemberManagementComponent {
  isLightTheme: boolean = true;
  memberForm: FormGroup;
  modalRef?: BsModalRef;
  passwordStrength: string | null = null;
  branchId: number = 1;
  memberId: number = 0;
  memberName:string="";
  searchText: string = '';
  @ViewChild('memberFormTemplate') memberFormTemplate!: TemplateRef<any>;
  members: Member[] = [];  // Members for the current page
  allMembers: Member[] = [];
  totalRecords: number = 0;  // Total number of records
  pageSize: number = 6;  // Records per page
  pageIndex: number = 0;
  userRole:string='';
  staffId!:number;
  branches: Branch[] = [];
  selectedBranch: number = this.branchId


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
    const staffId = localStorage.getItem('UserId');

    this.userRole = role;
    this.branchId = branchId ? parseInt(branchId) : 0;
    this.staffId = staffId ? parseInt(staffId) : 0;

    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      NIC: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/)]],
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

  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });

    this.loadMembers();
    this.loadBranches();

    this.spinner.show();


    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }


  // Fetch members with pagination params (pageIndex and pageSize)
  loadMembers(pageIndex: number = 1, pageSize: number = 6, branchId: number = this.branchId): void {
    this.adminService.getAllMembers(pageIndex, pageSize, true, branchId).subscribe(response => {
      this.members = response.data;
      this.totalRecords = response.totalRecords;
      console.log(pageIndex, pageSize)
      console.log('Loaded members:', this.members);
      this.spinner.hide();

    });
  }

  onBranchChange(branchId: number): void {
    if (branchId !== null) {
      this.selectedBranch = branchId;

      this.loadMembers();
    } else {
      this.selectedBranch = this.branchId;
    }
  }

  loadBranches(): void {
    this.adminService
      .getAllBranches()
      .subscribe((response: PaginationResponse<Branch>) => {

        this.branches = response.data.filter((branch) => branch.isActive);
        this.totalRecords = response.totalRecords;
      });
      this.spinner.hide();
  }

  // Handle page change event from the paginator
  onPageChange(event: any): void {
    const pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    // Fetch data with the correct page number and page size
    this.loadMembers(pageIndex, this.pageSize);
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
      formData.append('BranchId', this.branchId.toString());  
      formData.append('Password', this.memberForm.get('phone')?.value); 
      formData.append('IsActive', "true");
      formData.append('Gender', "male");

      // Append address fields
      const address = this.memberForm.get('address')?.value;
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
            console.log('Member updated successfully', response);
            this.toastr.success("Member updated successfully", "Member Update", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadMembers();
            this.memberId = 0;
            this.memberForm.reset();
          },
          error => {
            console.log('Error updating member', error);
            this.toastr.error('There was an error updating the member.', 'Error');
          }
        );
      } else {
        // If no memberId, create a new member

      
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
            this.modalRef?.hide();
            this.loadMembers();
          },
          error => {
            console.log('Error creating member', error);
            this.toastr.error('There was an error creating the member.', 'Error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }


  editMember(memberId: number): void {
    const member = this.members.find(m => m.memberId === memberId);
    if (member) {
      this.memberId = memberId; // Set memberId for updating

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
          country: member.address?.country || ''
        }
      });
      this.openModalWithClass(this.memberFormTemplate); // Open modal with pre-filled data
    }
  }


  isRequired(field: string): boolean {
    return this.memberForm.get(field)?.hasValidator(Validators.required) ?? false;
  }

  decline() {
    this.modalRef?.hide();
  }

  confirm() {
    this.adminService.deleteMember(this.memberId).subscribe(
      (response) => {

        this.toastr.success("Member Deleted successfully", "Delete Member", {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr'
        });
        this.modalRef?.hide();
        this.memberId = 0;
        this.loadMembers();
      },
      error => {
        console.log('Error creating member', error);
        this.toastr.error('There was an error delete the member.', 'Error');
      }
    );
    this.modalRef?.hide();
  }

  openModalWithClass(template: TemplateRef<void>) {
    console.log(this.memberId)
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));

    this.modalRef.onHide?.subscribe(() => {
      this.memberForm.reset();
      this.memberId = 0;
      // Reset form when modal is closed
    });
  }

  openModal(template: TemplateRef<void>, Id: number) {
    this.memberId = Id;
    const findedMember = this.members.find(m => m.memberId === Id);
    if(findedMember){
      this.memberName = findedMember.firstName +" "+ findedMember.lastName
    }

    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'modal-md' }) );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }

}
