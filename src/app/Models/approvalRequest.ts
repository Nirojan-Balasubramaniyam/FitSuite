export interface ApprovalRequest {
    requestId: number;
    requestType: string;
    memberId?: number;
    paymentType?: string;
    amount?: number;
    receiptNumber?: string;
    paidDate?: string; // Date as string (ISO format)
    dueDate?: string;  // Date as string (ISO format)
    status: string;
    programId?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    nic?: string;
    email?: string;
    dob?: string; // Date as string (ISO format)
    gender?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    imagePath?: string;
    password?: string;
  }
  