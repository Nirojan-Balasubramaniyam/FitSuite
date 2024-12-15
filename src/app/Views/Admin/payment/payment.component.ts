import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Service/Staff/admin.service';
import { Member } from '../../../Models/member';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MemberFilterPipe } from '../../../Pipes/MemberFilter/member-filter.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';
import { Payment, PaymentReq } from '../../../Models/payment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MemberFilterPipe,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {

  isLightTheme: boolean = true;
  isLargeScreen: boolean = false;
  allMembers: Member[] = [];
  member?: Member;
  selectedMemberPayment?: Payment;
  selectedMember: number | null = null;
  selectedMonth: number | null = 1;
  months: any[] = [];
  trainingProgramsByType: { [typeName: string]: TrainingProgram[] } = {};
  payment:number=0;
  totalPayment: number =0;
  selectedPaymentMethod: string = 'Cash';
  activeStatus:boolean =true;
  dueRemainingDays: number = 0;
  modalRef?: BsModalRef;


  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private enrollService: EnrollProgramService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
    this.spinner.show();
    this.checkScreenSize();
    this.loadMonths();
    this.loadAllMembers();
  }

  loadMonths(): void {
    // Example: Load months
    this.months = [
      { id: 1, name: '1 Month', discount: 0 }, 
      { id: 3, name: '3 Month', discount: 20 },
      { id: 6, name: '6 Month', discount: 30 },
      { id: 12, name: '12 Month', discount: 40 }
      // Add all months here...
    ];
    this.spinner.hide();
  }

  loadAllMembers(): void {
    this.adminService.getAllMembers(0, 0, true, 1).subscribe((data) => {
      this.allMembers = data.data;
      this.spinner.hide();

      console.log(this.allMembers);
    });
  }

  loadMember(): void {
    if (this.selectedMember !== null) {
      this.adminService.getMember(this.selectedMember).subscribe((data) => {
        this.member = data;
        this.payment = data.monthlyPayment;
       // this.spinner.hide();
      });
    }
  }

  loadMemberPayment(): void {
    if (this.selectedMember !== null) {
      this.paymentService.getLastRenewalPaymentForMember(this.selectedMember).subscribe((data) => {
        this.selectedMemberPayment = data;
        this.dueRemainingDays = this.calculateRemainingDays(data.dueDate);
        this.activeStatus = data.dueDate> new Date().toISOString().split('T')[0] ? true : false;
        //this.spinner.hide();
      });
    }
  }

  loadTrainingProgramsForMember(memberId: number): void {
    this.enrollService
      .getTrainingProgramsByMemberId(memberId)
      .subscribe((programs) => {
        // Group programs by 'typeName'
        this.trainingProgramsByType = programs.reduce((acc, program) => {
          const typeName = program.typeName || 'Uncategorized'; // Default to 'Uncategorized' if no typeName
          if (!acc[typeName]) {
            acc[typeName] = [];
          }
          acc[typeName].push(program);
          return acc;
        }, {} as { [typeName: string]: TrainingProgram[] });

        console.log(this.trainingProgramsByType)
      });
  }

  onMemberChange(memberId: number | null): void {
    if (memberId !== null) {
      this.selectedMember = memberId;
      this.selectedMonth = 1;
      this.payment=0;

      this.loadMember();
      this.loadMemberPayment();
      this.loadTrainingProgramsForMember(memberId);
    } else {
      this.selectedMember = null;
    }
  }

  onMonthChange(month: number | null): void {
    if (month !== null) {
     
      this.selectedMonth = month;

      if(this.member){
        this.totalPayment = this.member.monthlyPayment * month;
        this.payment = this.calculateDiscountedAmount(this.member.monthlyPayment,month.toString());

        let paymentType: string = "Monthly";
        if (this.selectedMonth === 1) {
          paymentType = "Monthly";
        } else if (this.selectedMonth === 3) {
          paymentType = "Quarterly";
        } else if (this.selectedMonth === 6) {
          paymentType = "Semi-Annual";
        } else if (this.selectedMonth === 12) {
          paymentType = "Annually";
        }

        console.log(paymentType)

      }
    } else {
      this.selectedMember = null;
    }
  }

  decline() {
    this.modalRef?.hide();
    this.resetFields();
  }

  confirm() {
    if (this.selectedMember != null) {
      //payment
      let paymentType: string = "Monthly";
      if (this.selectedMonth === 1) {
        paymentType = "Monthly";
      } else if (this.selectedMonth === 3) {
        paymentType = "Quarterly";
      } else if (this.selectedMonth === 6) {
        paymentType = "Semi-Annual";
      } else if (this.selectedMonth === 12) {
        paymentType = "Annually";
      }

      const newPayment: PaymentReq = {
        memberId: this.selectedMember,
        paymentType:  paymentType,
        amount: this.payment,
        paymentMethod: this.selectedPaymentMethod,
        paidDate: new Date().toISOString().split('T')[0]
      }
      this.paymentService.createPayment(newPayment).subscribe(
        (response) => { 
          this.toastr.success(`Payment Updated successfully`, "Make Payment", {
            timeOut: 3000,
            closeButton: true,
            easing: 'ease-in',
            progressBar: true,
            toastClass: 'ngx-toastr'
          });
          this.modalRef?.hide();
          this.resetFields();
        },
        error => {
          console.log('Error adding Payment', error);
          this.toastr.error('There was an error adding payment.', 'Error');
        }
      );
    } 
    this.modalRef?.hide();
  }

  
  calculateRemainingDays(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const remainingTime = due.getTime() - today.getTime();
    return Math.ceil(remainingTime / (1000 * 3600 * 24)); // Convert to days
  }


  openModal(template: TemplateRef<void>) {

    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }

  resetFields() {
    this.selectedMonth = null;
    this.selectedMember = null;
    this.selectedPaymentMethod = "Cash";
  }
  

  calculateDiscountedAmount(amount: number, months: string): number {
    let finalAmount = amount; 
   
    switch (months) {
      case "1":
        finalAmount = amount; // No discount for 1 month
        break;
      case "3":
        finalAmount = (3 * amount) - ((3 * amount) * 0.20); 
        break;
      case "6":
        finalAmount = (6 * amount) - ((6 * amount) * 0.3); 
        break;
      case "12":
        finalAmount = (12 * amount) - ((12 * amount) * 0.4); 
        break;
      default:
        console.log("Invalid months value. Defaulting to the base amount.");
        return Math.round(finalAmount / 100) * 100;
    }
  
    console.log(`Final Amount Before Rounding: ${finalAmount}`); 
  
    return months === "1" ? finalAmount : Math.round(finalAmount / 100) * 100;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992; // Bootstrap lg breakpoint
  }
}
