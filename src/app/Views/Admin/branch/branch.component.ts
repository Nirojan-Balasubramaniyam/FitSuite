import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Branch, BranchReq } from '../../../Models/branch';
import { AdminService } from '../../../Service/Staff/admin.service';
import { PaginationResponse } from '../../../Models/pagination';
import { CommonModule } from '@angular/common';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgxSpinnerModule,
  ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css',
})
export class BranchComponent implements OnInit {
  branches: Branch[] = [];
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  isLightTheme: boolean = true;
  branchId = 0;
  adminName: string = '';
  modalRef?: BsModalRef;
  branchForm: FormGroup;
  @ViewChild('branchormTemplate') branchormTemplate!: TemplateRef<any>;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private themeService: ThemeService,
    private spinner: NgxSpinnerService
  ) {
    this.branchForm = this.fb.group({
      branchName: ['', Validators.required],
      branchAdminId: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadBranches();

    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
  }

  loadBranches(): void {
    this.adminService
      .getAllBranches()
      .subscribe((response: PaginationResponse<Branch>) => {
        // Filter branches to only include active ones (isActive = true)
        this.branches = response.data.filter((branch) => branch.isActive);
        this.totalRecords = response.totalRecords;
      });
      this.spinner.hide();
  }

  onCreateBranch(): void {
    if (this.branchForm.valid) {
      const branchRequest: BranchReq = this.branchForm.value;
      if(this.branchId!=0){
          
          this.adminService.updateBranch(this.branchId, branchRequest).subscribe(
            (response) => {
              console.log('branch updated successfully', response);
              this.toastr.success("Branch updated successfully", "Branch Update", {
                timeOut: 5000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr'
              });
              this.modalRef?.hide();
              this.loadBranches();
              this.branchId = 0;
              this.branchForm.reset();
            },
            error => {
              console.log('Error updating staff', error);
              this.toastr.error('There was an error updating the staff.', 'Error');
            }
          );

      }else{
        this.adminService.createBranch(branchRequest).subscribe(
          (response) => {
            console.log('Branch created successfully', response);
            this.toastr.success("Branch created successfully", "Branch Creation", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadBranches();
          },
          error => {
            console.log('Error creating staff', error);
            this.toastr.error('There was an error creating the staff.', 'Error');
          }
        ); 

      }
   
    } else {
      this.branchForm.markAllAsTouched();
    }
  }
  

  onEdit(branchId: number) {
    //this.router.navigate(['/edit-task', taskId]);
    const branch = this.branches.find(m => m.branchId === branchId);
    if (branch) {
      this.branchId = branchId; 

      this.branchForm.patchValue({
        branchName: branch.branchName,
        branchAdminId: branch.branchAdminId,
        address: {
          street: branch.address?.street || '',
          city: branch.address?.city || '',
          province: branch.address?.province || '',
          country: branch.address?.country || ''
        }
      });
      this.openModalWithClass(this.branchormTemplate); // Open modal with pre-filled data
    }
  }

  openModal(template: TemplateRef<void>, branchID: number) {
    this.branchId = branchID;
    this.modalRef = this.modalService.show(template);
    this.modalRef.onHide?.subscribe(() => {
      this.branchForm.reset();
      this.branchId=0;
      // Reset form when modal is closed
    });
  }

  openModalWithClass(template: TemplateRef<void>) {
    
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));

    this.modalRef.onHide?.subscribe(() => {
      this.branchForm.reset();
      this.branchId=0;
      // Reset form when modal is closed
    });
  }

  confirm() {
    this.modalRef?.hide();
    this.adminService.deleteBranch(this.branchId).subscribe((data) => {
      this.toastr.success('Branch is deleted successfully', 'Deleted', {
        timeOut: 10000,
        closeButton: true,
      });
      this.loadBranches();
    });
  }

  decline() {
    this.modalRef?.hide();
  }

  isRequired(field: string): boolean {
    return (
      this.branchForm.get(field)?.hasValidator(Validators.required) ?? false
    );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }
}
