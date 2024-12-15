import { Component, HostListener, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../../Models/member';
import { Payment, PaymentReq } from '../../../Models/payment';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MemberFilterPipe } from '../../../Pipes/MemberFilter/member-filter.pipe';

@Component({
  selector: 'app-member-payment',
  standalone: true,
   imports: [
      CommonModule,
      NgxSpinnerModule,
      MemberFilterPipe,
      NgSelectModule,
      FormsModule,
      ReactiveFormsModule
    ],
  templateUrl: './member-payment.component.html',
  styleUrl: './member-payment.component.css'
})
export class MemberPaymentComponent {

   isLightTheme: boolean = true;
   member: Member | null = null; 

    isLargeScreen: boolean = false;
    allMembers: Member[] = [];
    // member?: Member;
    memberIdPayment?: Payment;
    memberId!: number;
    selectedMonth: number | null = 1;
    months: any[] = [];
    trainingProgramsByType: { [typeName: string]: TrainingProgram[] } = {};
    payment:number=0;
    totalPayment: number =0;
    selectedPaymentMethod: string = 'Cash';
    activeStatus:boolean =true;
    dueRemainingDays: number = 0;
    modalRef?: BsModalRef;
receiptNumber: any;
paymentForm: FormGroup;
  
  
    constructor(
      private themeService: ThemeService,
      private adminService: AdminService,
      private spinner: NgxSpinnerService,
      private modalService: BsModalService,
      private enrollService: EnrollProgramService,
      private paymentService: PaymentService,
      private toastr: ToastrService,
      private fb: FormBuilder
    ) {
      const memberId = localStorage.getItem('UserId');

      this.memberId = memberId ? parseInt(memberId) : 0;
      this.paymentForm = this.fb.group({
        paymentReceipt: ['', Validators.required], // Field with required validation
      });
    }
  
    ngOnInit(): void {
      this.themeService.lightTheme$.subscribe((data) => {
        this.isLightTheme = data;
        console.log(this.isLightTheme);
      });
      this.spinner.show();
      this.loadMonths();
      this.loadMember();
      this.loadMemberPayment();
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

    loadMember(): void {
      this.adminService.getMember(this.memberId).subscribe(response => {
        this.member = response;
        this.totalPayment = response.monthlyPayment;
        console.log(this.member)
    
        this.spinner.hide();
      });
    }

  
    loadMemberPayment(): void {
      if (this.memberId !== null) {
        this.paymentService.getLastRenewalPaymentForMember(this.memberId).subscribe((data) => {
          this.memberIdPayment = data;
          this.dueRemainingDays = this.calculateRemainingDays(data.dueDate);
          this.activeStatus = data.dueDate> new Date().toISOString().split('T')[0] ? true : false;
          //this.spinner.hide();
        });
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
      }
    }
  
    decline() {
      this.modalRef?.hide();
      this.resetFields();
    }
  
    confirm() {
      if (this.memberId != null) {
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
          memberId: this.memberId,
          paymentType:  paymentType,
          amount: this.payment,
          paymentMethod: this.selectedPaymentMethod,
          paidDate: new Date().toISOString().split('T')[0]
        }
        this.paymentService.createPayment(newPayment).subscribe(
          (response) => { 
            this.toastr.success(`Payment Request Added Successfully`, "Make Payment", {
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

    isRequired(field: string): boolean {
      return (
        this.paymentForm.get(field)?.hasValidator(Validators.required) ?? false
      );
    }
  
    getLabelBackground() {
      return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
    }
  
}
