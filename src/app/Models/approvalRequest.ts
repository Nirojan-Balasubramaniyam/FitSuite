import { AddressDto } from "./address";

export interface ApprovalRequest {
    requestId: number;
    requestType: string;
    memberId?: number;
    paymentType?: string;
    amount?: number;
    receiptNumber?: string;
    paidDate?: string;
    dueDate?: string;  
    status: string;
    programId?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    nic?: string;
    email?: string;
    dob?: string; 
    gender?: string;
    branchId: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    imagePath?: string;
    password?: string;
    address?: AddressDto;
  }
  