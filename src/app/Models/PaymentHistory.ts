export interface PaymentHistory {
    paymentType: string;
    amount: number;
    paidDate: string;
    dueDate?: string;
    memberId: number;
  }