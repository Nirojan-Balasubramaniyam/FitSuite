export interface PaymentRequest {
    requestId: number;
    requestType: string;
    memberId?: number;
    paymentType: string;
    amount?: number;
    receiptNumber: string;
    paidDate?: string; 
    dueDate?: string;  
    status: string;
  }

  export interface PaymentRequestDTO {
    memberId?: number;
    paymentType: string;
    amount?: number;
    receiptNumber: string;
    paidDate?: string;
    dueDate?: string; 
  }
  