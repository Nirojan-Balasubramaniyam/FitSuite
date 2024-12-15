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

  export interface BranchReq {
    branchName:string;
    branchAdminId:string;
    address?: Address
  }