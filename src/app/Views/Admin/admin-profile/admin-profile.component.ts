import { Component, OnInit } from '@angular/core';
import { Staff } from '../../../Models/staff';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})

export class AdminProfileComponent implements OnInit {
  branchId: number = 1;
  userRole:string='';
  staffId!:number;
  isLightTheme: boolean = true;
    isNavbarVisible: boolean = true;
  
    member: Staff | null = null;
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
  ){
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
          NIC: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/),
            ],
          ],
          phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
    this.adminService.getStaffById(this.staffId).subscribe((response) => {
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
    // const member = this.allMembers.find((m) => m.staffId === this.staffId);
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
    this.adminService.deleteMember(this.staffId).subscribe(
      (response) => {
        this.toastr.success('Member Deleted successfully', 'Delete Member', {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr',
        });
        this.modalRef?.hide();
        this.staffId = 0;
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

      if (this.staffId != 0) {
        // If staffId exists, update the member
        this.adminService.updateStaff(this.staffId, formData).subscribe(
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
            this.staffId = 0;
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
