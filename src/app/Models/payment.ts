export interface Payment {
    paymentId: number;
    memberId: number;
    paymentType: string;  
    amount: number;
    paymentMethod: string; 
    paidDate: string;  
    dueDate: string;  
  }

  export interface PaymentReq {
    memberId: number;
    paymentType: string;  
    amount?: number;
    paymentMethod: string;  
    paidDate?: string;  
  }