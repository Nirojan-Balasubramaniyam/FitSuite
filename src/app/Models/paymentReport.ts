export interface PaymentReport {
  paymentId: number;
  memberId: number;
  memberName: string;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  dueDate: string;
}
