import { Address } from "./address";
import { Branch } from "./branch";

export interface Member {
    memberId: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string; 
    nic: string;
    phone: string;
    doB: string; 
    gender: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    imagePath?: string; 
    monthlyPayment:number;
    trainerId?: number; 
    //staff?: Staff; 
    branchId: number;
    branch: Branch; 
    address?: Address;
    isActive: boolean;
}