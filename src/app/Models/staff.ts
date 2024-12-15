import { Address } from "./address";

export interface Staff {
    staffId: number;
    firstName: string;
    lastName: string;
    email: string;
    nic: string;
    phone: string;
    doB: string;  
    gender: string;
    imagePath?: string;
    userRole: UserRole;
    isActive: boolean;
    branchId: number;
    address?: Address;
    // Other fields as required
  }

  export interface StaffReq {
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  phone: string;
  doB: string; 
  gender: string;
  isActive: boolean;
  imagePath?: string;
  userRole: UserRole;
  branchId: number;
  address?: Address;
    // Other fields as required
  }

  enum UserRole {
    SuperAdmin = 1,
    Admin = 2,
    Trainer = 3,
    Member = 4
  }
  