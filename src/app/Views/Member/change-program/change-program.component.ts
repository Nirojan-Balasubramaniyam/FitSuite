import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { EnrollProgram, EnrollProgramReq } from '../../../Models/enrollProgram';
import { Member } from '../../../Models/member';
import { ProgramType } from '../../../Models/programType';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { ToastrService } from 'ngx-toastr';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FilterProgramPipe } from '../../../Pipes/Enroll-Program/filter-program.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';
import { Payment, PaymentReq } from '../../../Models/payment';
import { ProgramAddonRequestDTO } from '../../../Models/programAddonRequest';
import { LeaveProgramRequestDTO } from '../../../Models/leaveProgramRequest';
import { ApprovalRequestService } from '../../../Service/Admin/Request/approval-request.service';

@Component({
  selector: 'app-change-program',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxSpinnerModule,
    FilterProgramPipe,
    ReactiveFormsModule
  ],
  templateUrl: './change-program.component.html',
  styleUrl: './change-program.component.css',
})
export class ChangeProgramComponent implements OnInit {
  additionalPayment!: number;
  isLargeScreen: boolean = true;
  monthlyPayment!: number;
  totalPayment!: number;
  remainingDays!: number;

  isLightTheme: boolean = true;
  searchText: string = '';
  programTypes: ProgramType[] = [];
  programs: TrainingProgram[] = [];
  programsByType: { [typeId: number]: TrainingProgram[] } = {};
  memberId!: number;
  selectedPrograms: number[] = []; // Store selected program IDs
  enrolledPrograms: number[] = []; // Store enrolled program IDs
  currentlySelectedPrograms: TrainingProgram[] = [];
  leavingPrograms: number[] = [];
  newlySelectedPrograms: TrainingProgram[] = [];
  allEnrollPrograms: EnrollProgram[] = [];
  enrolledProgramsByType: { [typeId: number]: number[] } = {};
  modalRef?: BsModalRef;
  lastPayment?: Payment;
  paymentForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private enrollProgramService: EnrollProgramService,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private requestService: ApprovalRequestService
  ) {

    const memberId = localStorage.getItem('UserId');

    this.memberId = memberId ? parseInt(memberId) : 0;

    this.paymentForm = this.fb.group({
      paymentReceipt: ['', Validators.required], // Field with required validation
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadEnrolledProgramsForMember(this.memberId);

    this.loadPrograms();
    this.loadProgramTypes();

    this.loadLastPayment();
  }

  loadPrograms(): void {
    this.adminService.getAllTrainingPrograms().subscribe((programs) => {
      this.programs = programs;
      this.programsByType = this.programs.reduce((acc, program) => {
        if (!acc[program.typeId]) {
          acc[program.typeId] = [];
        }
        acc[program.typeId].push(program);
        return acc;
      }, {} as { [typeId: number]: TrainingProgram[] });
      this.spinner.hide();
    });
  }

  loadProgramEnrolls(): void {
    this.enrollProgramService.getAllEnrollPrograms().subscribe((enrolls) => {
      this.allEnrollPrograms = enrolls;
    });
  }
  loadProgramTypes(): void {
    // Fetch program types from API or service
    this.adminService.getAllProgramTypes().subscribe((types) => {
      this.programTypes = types;
    });
  }

  loadEnrolledProgramsForMember(memberId: number): void {
    this.enrolledPrograms = [];
    this.enrollProgramService
      .getTrainingProgramsByMemberId(memberId)
      .subscribe((response) => {
        this.currentlySelectedPrograms = response;
        this.enrolledPrograms = response.map((program) => program.programId);

        console.log('ee', this.enrolledPrograms);
        this.calculateTotal();

        if (response.length > 0) {
          response.forEach((program) => {
            if (!this.enrolledProgramsByType[program.typeId]) {
              this.enrolledProgramsByType[program.typeId] = [];
            }
            this.enrolledProgramsByType[program.typeId].push(program.programId);
          });
        }
      });
    this.spinner.hide();
  }

  //   onMonthChange() {
  //     let total: number = 0;

  //     // Reset payments
  //     this.totalPayment = 0;
  //     this.discountedPayment = 0;

  //     // Fetch newly selected programs
  //     this.newlySelectedPrograms = this.getNewlySelectedPrograms();

  //     // Calculate the total cost of selected programs
  //     total = this.calculateTotalProgramsCost(this.newlySelectedPrograms);

  //     console.log("total", total);
  //     console.log("month", this.selectedMonth);

  //     this.totalPayment = total;
  //     if (this.selectedMonth) {
  //         this.totalPayment = total * this.selectedMonth; // Calculate base payment
  //         console.log("Base Total Payment (before discount):", this.totalPayment);

  //         // Apply discount based on the selected month
  //         this.discountedPayment = this.calculateDiscountedAmount(total, this.selectedMonth.toString());
  //         console.log("Discounted Total Payment:", this.totalPayment);
  //     }
  // }

  onProgramSelectionChange(programId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const program = this.programs.find((p) => p.programId === programId);

    if (program) {
      if (isChecked) {
        this.selectedPrograms.push(programId);
        // If this program was previously in leavingPrograms, remove it
        const leavingProgramIndex = this.leavingPrograms.indexOf(programId);
        if (leavingProgramIndex > -1) {
          this.leavingPrograms.splice(leavingProgramIndex, 1);
        }
        if (!this.enrolledPrograms.includes(programId)) {
          this.newlySelectedPrograms.push(program);
        }

        if (this.enrolledPrograms.includes(programId)) {
          this.currentlySelectedPrograms.push(program);
        }
        this.calculateTotal();
      } else {
        // Remove the program from selectedPrograms and leavingPrograms
        const index = this.selectedPrograms.indexOf(programId);
        if (index > -1) {
          this.selectedPrograms.splice(index, 1);
        }

        if (this.enrolledPrograms.includes(programId)) {
          this.leavingPrograms.push(programId);
          const programIndex = this.currentlySelectedPrograms.findIndex(
            (p) => p.programId === programId
          );
          if (programIndex > -1) {
            this.currentlySelectedPrograms.splice(programIndex, 1);
          }
        }
        this.calculateTotal();
      }
    }

    // Update the program lists
    this.newlySelectedPrograms = this.getNewlySelectedPrograms();
    this.calculateTotal();
    console.log('current', this.currentlySelectedPrograms);
    console.log('new', this.newlySelectedPrograms);
    console.log('lea', this.leavingPrograms);
  }

  getNewlySelectedPrograms(): TrainingProgram[] {
    return this.selectedPrograms
      .map((programId) =>
        this.programs.find((program) => program.programId === programId)
      )
      .filter(
        (program) =>
          program !== undefined &&
          !this.enrolledPrograms.includes(program.programId)
      ) as TrainingProgram[];
  }

  loadLastPayment(): void {
    this.paymentService
      .getLastRenewalPaymentForMember(5)
      .subscribe((lastPayment) => {
        if (!lastPayment) {
          this.spinner.hide();
          return;
        }
        this.lastPayment = lastPayment;
      });
  }
  calculateTotal(): void {
    const newlySelectedTotal = this.calculateTotalProgramsCost(
      this.newlySelectedPrograms
    );
    const enrolledTotal = this.calculateTotalProgramsCost(
      this.currentlySelectedPrograms
    );

    const total = newlySelectedTotal + enrolledTotal;
    this.totalPayment = total;

    if (this.lastPayment) {
      this.remainingDays = this.calculateRemainingDays(
        this.lastPayment.dueDate
      );
      this.additionalPayment = this.calculateAdditionalPayment(
        this.newlySelectedPrograms,
        this.remainingDays
      );
    }

    console.log('Total Cost of Newly Selected Programs:', newlySelectedTotal);
    console.log('Total Cost of Enrolled Programs:', enrolledTotal);
    console.log('Total Program Cost:', total);
  }

  calculateTotalProgramsCost(programs: TrainingProgram[]): number {
    return programs.reduce((total, program) => total + program.cost, 0);
  }

  calculateRemainingDays(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const remainingTime = due.getTime() - today.getTime();
    return Math.ceil(remainingTime / (1000 * 3600 * 24)); // Convert to days
  }

  calculateAdditionalPayment(
    programs: TrainingProgram[],
    remainingDays: number
  ): number {
    const totalCost = this.calculateTotalProgramsCost(programs);

    const today = new Date();
    const daysInCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate(); // Get current day in month

    const additionalPayment = (totalCost / daysInCurrentMonth) * remainingDays;

    return Math.round(additionalPayment * 100) / 100;
  }



  resetForm(): void {
    location.reload()
    this.selectedPrograms = [];
    this.enrolledPrograms = [];
    this.newlySelectedPrograms = [];
    this.leavingPrograms = [];
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md' })
    );
  }

  decline() {
    this.modalRef?.hide();
  }
  confirm() {
    if (this.enrolledPrograms.length == 0) {
      this.toastr.error('Please Enroll the Programs First.', 'Error');
      return;
    }

    if (this.newlySelectedPrograms.length >= 1) {
      this.newlySelectedPrograms.forEach((program) => {
        const enrollment: ProgramAddonRequestDTO = {
          memberId: this.memberId!,
          programId: program.programId,
          amount: this.additionalPayment,
          receiptNumber: this.paymentForm.get('paymentReceipt')?.value,
          paidDate: new Date().toISOString().split('T')[0]
        };

        this.requestService.createProgramAddonRequest(enrollment).subscribe(
          (response) => {
            console.log("Program Enrolled successfully")
            //this.selectedMember = 0;
          },
          (error) => {
            console.error('Error creating enrollment:', error);
            this.toastr.error('There was an error deleting the Training Program.', 'Error');
          }
        );
      });

      this.toastr.success(
        `Enrollment Update Request added successfully`,
        'Program Enroll Update',
        {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr',
        }
      );
      //this.resetForm();
      this.loadEnrolledProgramsForMember(this.memberId);
      this.loadPrograms();
      this.loadProgramTypes();
      this.loadLastPayment();
      this.modalRef?.hide();
    }
    if (this.leavingPrograms.length >= 1) {
      this.leavingPrograms.forEach((programId) => {
        const newLeaveProgramRequest: LeaveProgramRequestDTO   = {
          programId:programId,
          memberId:this.memberId!

        };

          this.requestService
            .createLeaveProgramRequest(newLeaveProgramRequest)
            .subscribe(
              (response) => {
                console.log(
                  `Enrollment with Program ID: ${programId} deleted successfully.`
                );
              },
              (error) => {
                console.error(
                  `Error deleting enrollment for Program ID: ${programId}`,
                  error
                );
                this.toastr.error(
                  `There was an error deleting the enrollment for program ${programId}.`,
                  'Error Deleting Enrollment'
                );
              }
            );
        
      });
      this.toastr.success(
        `Enrollment Update Request added successfully.`,
        'Program Enroll Update',
        {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr',
        }
      );
    }

    this.modalRef?.hide();
    this.loadEnrolledProgramsForMember(this.memberId);
    this.loadPrograms();
    this.loadProgramTypes();
    this.loadLastPayment();
  }

  isRequired(field: string): boolean {
    return (
      this.paymentForm.get(field)?.hasValidator(Validators.required) ?? false
    );
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }
}
