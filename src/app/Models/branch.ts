import { Address } from "./address";

export interface Branch {
    branchId: number;
    branchName:string;
    branchAdminId:string;
    adminName:string;
    activeMembers:number;
    leavedMembers:number;
    isActive:boolean;
    address?: Address
  }