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
import { Member } from '../../../Models/member';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { EnrollProgram, EnrollProgramReq } from '../../../Models/enrollProgram';
import { AlertService } from '../../../Service/Admin/Alert/alert.service';
import { AlertReq } from '../../../Models/alert';
import { PaymentReq } from '../../../Models/payment';
import { jwtDecode } from 'jwt-decode';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';

@Component({
  selector: 'app-approval-request',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    RequestFilterPipe,
  ],
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.css',
})
export class ApprovalRequestComponent {
  isLightTheme: boolean = true;
  approvalRequests: ApprovalRequest[] = [];
  selectedRequest: ApprovalRequest | null = null;
  searchText: string = 'Pending';
  members: Member[] = [];
  branchId: number = 0;
  userRole: string = '';
  allEnrollPrograms: EnrollProgram[] = [];
  accessedDate: string = new Date().toISOString();
  modalRef?: BsModalRef;
  @ViewChild('requestDetailsModal') requestDetailsModal!: TemplateRef<any>;

  constructor(
    private themeService: ThemeService,
    private requestService: ApprovalRequestService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private enrollProgramService: EnrollProgramService
  ) {
    const role = localStorage.getItem('Role') || '';
    const branchId = localStorage.getItem('BranchId');

    this.userRole = role;
    this.branchId = branchId ? parseInt(branchId) : 0;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });

    this.loadRequests();
    this.loadMembers();
  }

  loadRequests(): void {
    this.requestService
      .getAllRequests()
      .subscribe((response: ApprovalRequest[]) => {
        // Filter branches to only include active ones (isActive = true)
        this.approvalRequests = response;

        console.log(this.approvalRequests);
      });
    this.spinner.hide();
  }

  loadMembers(): void {
    this.adminService
      .getAllMembers(0, 0, true, this.branchId)
      .subscribe((response) => {
        this.members = response.data;

        this.spinner.hide();
      });
  }

  loadProgramEnrolls(): void {
    // Fetch program types from API or service
    this.enrollProgramService.getAllEnrollPrograms().subscribe((enrolls) => {
      this.allEnrollPrograms = enrolls;
    });
  }

  getMemberName(memberId: number): string {
    if (memberId === -1) {
      return 'New Member';
    }
    const member = this.members.find((m) => m.memberId === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'New Member';
  }

  approveRequest(request: ApprovalRequest): void {
    if (request) {
      switch (request.requestType) {
        case 'Payment':
          this.handlePaymentRequest(request);
          break;
        case 'LeaveProgram':
          this.handleProgramLeaveRequest(request);
          break;
        case 'ProgramAddon':
          this.handleProgramAddonRequest(request);
          break;
        case 'MemberInfo':
          this.handleNeworChangeMemberRequest(request);
          break;
        case 'NewMember':
          this.handleNeworChangeMemberRequest(request);
          break;
        default:
          console.log('Other request type handling not implemented');
      }
      this.updateRequestStatus(request, 'accepted');
      this.modalRef?.hide();
      this.loadRequests();
    }
  }

  handleProgramLeaveRequest(request: ApprovalRequest) {
    if (request.memberId && request.programId) {
      let memberEnroll = this.allEnrollPrograms.find(
        (enroll) =>
          enroll.programId === request.programId &&
          enroll.memberId === request.memberId
      );
      if (memberEnroll) {
        this.enrollProgramService
          .deleteEnrollProgram(memberEnroll?.enrollId)
          .subscribe((response) => {
            const newAlert: AlertReq = {
              alertType: 'leaveProgramRequestMessage',
              amount: 0,
              programId: request.programId,
              accessedDate: this.accessedDate,
              memberId: request.memberId,
              action: true,
              status: true,
            };
            this.alertService.addAlert(newAlert).subscribe((alert) => {});
            this.toastr.success(
              `Approval Accepted & Program leaved successfully.`,
              'Approval Accepted',
              {
                timeOut: 3000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr',
              }
            );
          });
      }
    }
  }

  handleNeworChangeMemberRequest(request: ApprovalRequest) {
    const newMember = new FormData();

    // Append form control values
    newMember.append('FirstName', request.firstName?.toString() || '');
    newMember.append('LastName', request.lastName?.toString() || '');
    newMember.append('Email', request.email?.toString() || '');
    newMember.append('NIC', request.nic?.toString() || '');
    newMember.append('Phone', request.phone?.toString() || '');
    newMember.append(
      'EmergencyContactName',
      request.emergencyContactName?.toString() || ''
    );
    newMember.append(
      'EmergencyContactNumber',
      request.emergencyContactNumber?.toString() || ''
    );
    newMember.append('BranchId', request?.branchId.toString());
    newMember.append('Password', request.password?.toString() || '');
    newMember.append('IsActive', 'true');
    newMember.append('Gender', request.gender?.toString() || '');

    newMember.append(
      'Address.Street',
      request.address?.street?.toString() || ''
    );
    newMember.append('Address.City', request.address?.city?.toString() || '');
    newMember.append(
      'Address.Province',
      request.address?.province?.toString() || ''
    );
    newMember.append(
      'Address.Country',
      request.address?.country?.toString() || ''
    );

    if (request.requestType === 'newMemberRequest') {
      this.adminService.createMember(newMember).subscribe(
        (response: string) => {
          const decoded: any = jwtDecode(response);

          const newPayment: PaymentReq = {
            memberId: decoded.memberId,
            paymentType: 'Initial',
            amount: 2500,
            paymentMethod: 'Bank',
            paidDate: request.paidDate,
          };

          this.paymentService
            .createPayment(newPayment)
            .subscribe((response) => {});

          //send mail to new mwmber

          this.toastr.success(
            'Approval Accepted & Member created Successfully',
            'Approval Accepted',
            {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr',
            }
          );
        },
        (error) => {
          console.log('Error creating member', error);
          this.toastr.error('There was an error creating the member.', 'Error');
        }
      );
    } else if (request.requestType === 'changeMemberInfo') {
      if (request.memberId !== undefined) {
        this.adminService.updateMember(request.memberId, newMember).subscribe(
          (response) => {
            const newAlert: AlertReq = {
              alertType: 'memberInfoRequestMessage',
              amount: 0,
              memberId: request.memberId,
              accessedDate: this.accessedDate,
              action: true,
              status: true,
            };
            this.alertService.addAlert(newAlert).subscribe((alert) => {});

            this.toastr.success(
              'Approval Accepted & Member Updated Successfully',
              'Approval Accepted',
              {
                timeOut: 5000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr',
              }
            );
          },
          (error) => {
            this.toastr.error('There was an error update the member.', 'Error');
          }
        );
      }
    }
  }

  handleProgramAddonRequest(request: ApprovalRequest) {
    if (request.programId && request.memberId && request.amount) {
      const newEnroll: EnrollProgramReq = {
        programId: request.programId,
        memberId: request.memberId,
      };

      const newAlert: AlertReq = {
        alertType: 'programAddonRequestMessage',
        amount: request.amount,
        programId: request.programId,
        memberId: request.memberId,
        accessedDate: this.accessedDate,
        action: true,
        status: true,
      };

      const newPayment: PaymentReq = {
        memberId: request.memberId,
        paymentType: 'ProgramAddon',
        amount: request.amount,
        paidDate: request.paidDate,
        paymentMethod: 'Bank',
      };

      this.enrollProgramService.enrollProgram(newEnroll).subscribe(
        (response) => {
          this.paymentService.createPayment(newPayment).subscribe((response) => {});
          this.alertService.addAlert(newAlert).subscribe((response) => {});

          this.toastr.success(
            'Approval Accepted & Program Enrolled Successfully',
            'Approval Accepted',
            {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr',
            }
          );
        },
        (error) => {
          this.toastr.error(
            'There was an error add enroll for the member.',
            'Error'
          );
        }
      );
    }
  }

  handlePaymentRequest(request: ApprovalRequest) {
    if (request.memberId && request.amount && request.paymentType) {
      const newPayment: PaymentReq = {
        memberId: request.memberId,
        paymentType: request.paymentType,
        amount: request.amount,
        paidDate: request.paidDate,
        paymentMethod: 'Bank',
      };

      const newAlert: AlertReq = {
        alertType: 'paymentrequestMessage',
        amount: request.amount,
        memberId: request.memberId,
        accessedDate: this.accessedDate,
        action: true,
        status: true,
      };

      this.paymentService.createPayment(newPayment).subscribe({
        next:(response:any)=>{
          // this.alertService.addAlert(newAlert).subscribe((response) => {});
        },
        complete:()=>{
          this.modalRef?.hide();
          this.toastr.success(
              'Approval Accepted & Payment Added Successfully',
              'Approval Accepted',
              {
                timeOut: 5000,
                closeButton: true,
                easing: 'ease-in',
                progressBar: true,
                toastClass: 'ngx-toastr',
              }
            );
        },error:(error:any)=>{
          this.toastr.error(
            'There was an error add payment for the member.',
            'Error'
          );
        }
      });
    }
  }



  updateRequestStatus(request: ApprovalRequest, newStatus: string) {
    request.status = newStatus;
    this.requestService.updateRequest(request.requestId, request).subscribe(response => {})
   
};

  declineRequest(request: ApprovalRequest): void {
    if (request) {
      switch (request.requestType) {
          case 'Payment':
              const newAlert: AlertReq = {
                alertType: 'paymentrequestMessage',
                amount: request.amount,
                memberId: request.memberId,
                accessedDate: this.accessedDate,
                action: false,
                status: true,
              }

              this.alertService.addAlert(newAlert).subscribe((response) => {
                this.toastr.success(
                  'Approval Declined',
                  'Approval Declined',
                  {
                    timeOut: 5000,
                    closeButton: true,
                    easing: 'ease-in',
                    progressBar: true,
                    toastClass: 'ngx-toastr',
                  }
                );
              },
              (error) => {
                this.toastr.error(
                  'There was an error add payment for the member.',
                  'Error'
                );
              });

          
              break;


          case 'LeaveProgram':
            const leaveProgramAlert: AlertReq = {
              alertType: 'leaveProgramRequestMessage',
              amount: 0,
              programId: request.programId,
              accessedDate: this.accessedDate,
              memberId: request.memberId,
              action: true,
              status: true,
            };

            this.alertService.addAlert(leaveProgramAlert).subscribe((response) => {
              this.toastr.success(
                'Approval Declined',
                'Approval Declined',
                {
                  timeOut: 5000,
                  closeButton: true,
                  easing: 'ease-in',
                  progressBar: true,
                  toastClass: 'ngx-toastr',
                }
              );
            },
            (error) => {
              this.toastr.error(
                'There was an error add payment for the member.',
                'Error'
              );
            });

              break;


          case 'ProgramAddon':
               const programAddonAlert: AlertReq = {
                alertType: 'programAddonRequestMessage',
                amount: request.amount,
                programId: request.programId,
                memberId: request.memberId,
                accessedDate: this.accessedDate,
                action: false,
                status: true,
              }

              this.alertService.addAlert(programAddonAlert).subscribe((response) => {
                this.toastr.success(
                  'Approval Declined',
                  'Approval Declined',
                  {
                    timeOut: 5000,
                    closeButton: true,
                    easing: 'ease-in',
                    progressBar: true,
                    toastClass: 'ngx-toastr',
                  }
                );
              },
              (error) => {
                this.toastr.error(
                  'There was an error add payment for the member.',
                  'Error'
                );
              });
              
              break;

          case 'MemberInfo':
            const changeMemberInfoAlert: AlertReq = {
              alertType: 'memberInfoRequestMessage',
              amount: 0,
              memberId: request.memberId,
              accessedDate: this.accessedDate,
              action: false,
              status: true,
            }

            this.alertService.addAlert(changeMemberInfoAlert).subscribe((response) => {
              this.toastr.success(
                'Approval Declined',
                'Approval Declined',
                {
                  timeOut: 5000,
                  closeButton: true,
                  easing: 'ease-in',
                  progressBar: true,
                  toastClass: 'ngx-toastr',
                }
              );
            },
            (error) => {
              this.toastr.error(
                'There was an error add payment for the member.',
                'Error'
              );
            });

              break;

          default:
              console.log('Other request type handling not implemented');
              break;
      }
      this.updateRequestStatus(request, 'rejected');
      this.loadRequests();
      this.modalRef?.hide()
  }
  }

  openModalWithClass(template: TemplateRef<void>, request: ApprovalRequest) {
    this.selectedRequest = request;

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );

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
