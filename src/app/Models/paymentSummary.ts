export interface PaymentSummary {
  totalMonthlyPayment: number;
  totalPaid: number;
  remainAmountToPay: number;
  remainAmounToPayPercentage: number;
  overduePayment: number;
  paidPercentage: number;
  overduePercentage: number;
}
