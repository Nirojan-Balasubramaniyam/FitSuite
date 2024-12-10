import { Component,OnInit } from '@angular/core';
import { PaymentHistory } from '../../../Models/PaymentHistory';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent implements OnInit {
  loggedInUser = { memberId: 1 }; // Example logged-in user, adjust as necessary
  payments: PaymentHistory[]
   = [
    // Example payments data, replace this with actual data from your API or service
    { paymentType: 'Credit', amount: 100, paidDate: '2024-11-15', dueDate: '2024-11-30', memberId: 1 },
    { paymentType: 'Debit', amount: 200, paidDate: '2024-11-10', memberId: 1 }
  ];

  memberPayments: PaymentHistory[] = [];
  noPaymentMessage: string = '';

  ngOnInit() {
    this.displayPaymentHistory();
  }

  displayPaymentHistory(): void {
    this.memberPayments = this.payments.filter(payment => payment.memberId === this.loggedInUser.memberId);
    if (this.memberPayments.length === 0) {
      this.noPaymentMessage = "No payment history available.";
    } else {
      this.noPaymentMessage = '';
    }
  }

  formatDate(date: string): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US');
    return formattedDate;
  }


}
