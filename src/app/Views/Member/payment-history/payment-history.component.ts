import { Component,OnInit } from '@angular/core';
import { PaymentHistory } from '../../../Models/PaymentHistory';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { MemberService } from '../../../Service/Member/member.service';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent implements OnInit {
  memberId!: number;
  memberPayments: PaymentHistory[]= [];
  isLightTheme: boolean = true;


  noPaymentMessage: string = '';

    constructor(
      private themeService: ThemeService,
      private paymentService: PaymentService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private memberService: MemberService
    ) {
      const memberId = localStorage.getItem('UserId');

      this.memberId = memberId ? parseInt(memberId) : 0;
      
    }

  ngOnInit() {
    this.spinner.show()
    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });
    this.displayPaymentHistory();
  }

  displayPaymentHistory(): void {
    this.paymentService.getPaymentsForMember(this.memberId).subscribe(data => {
      this.memberPayments = data;

      this.spinner.hide();
      
    })
  }

  formatDate(date: string): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US');
    return formattedDate;
  }


}
