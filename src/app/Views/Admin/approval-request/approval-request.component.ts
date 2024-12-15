import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { ApprovalRequest } from '../../../Models/approvalRequest';
import { ApprovalRequestService } from '../../../Service/Admin/Request/approval-request.service';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../Service/Staff/admin.service';
import { HttpClientModule } from '@angular/common/http';
import { RequestFilterPipe } from '../../../Pipes/Request-Filter/request-filter.pipe';

@Component({
  selector: 'app-approval-request',
  standalone: true,
   imports: [
      CommonModule,
      HttpClientModule,
      NgxSpinnerModule,
      RequestFilterPipe
    ],
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.css',
})
export class ApprovalRequestComponent {
  isLightTheme: boolean = true;
  approvalRequests: ApprovalRequest[] = [];
  selectedRequest: ApprovalRequest | null = null;
  searchText: string = "Pending";
    modalRef?: BsModalRef;
    @ViewChild('requestDetailsModal') requestDetailsModal!: TemplateRef<any>;


  constructor(
    private themeService: ThemeService,
    private requestService: ApprovalRequestService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });

    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService
      .getAllRequests()
      .subscribe((response: ApprovalRequest[]) => {
        // Filter branches to only include active ones (isActive = true)
        this.approvalRequests = response;

        console.log(this.approvalRequests)
      });
    this.spinner.hide();
  }



  approveRequest(request: ApprovalRequest): void {
    console.log('Request approved:', request);
  }

  declineRequest(request: ApprovalRequest): void {
    console.log('Request declined:', request);
  }

    openModalWithClass(template: TemplateRef<void>, request:ApprovalRequest) {

      this.selectedRequest = request;
      
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  
      this.modalRef.onHide?.subscribe(() => {
        this.selectedRequest = null;
        // this.branchForm.reset();
        // this.branchId=0;
        // Reset form when modal is closed
      });
    }

    toggleSearchText(): void {
      // Toggle search text between 'Pending' and 'Reviewed'
      this.searchText = this.searchText === 'Pending' ? 'Reviewed' : 'Pending';
    }
}
