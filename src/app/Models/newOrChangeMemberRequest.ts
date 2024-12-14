import { Address } from "./address";

export interface NewOrChangeMemberRequest {
    requestId: number;
    requestType: string;
    memberId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    nic?: string;
    dob?: string; // Use string for ISO Date format
    gender?: string;
    paymentReceipt?: string;
    address?: Address;
    imageFile?: File;
    imagePath?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    password?: string;
    status: string;
  }