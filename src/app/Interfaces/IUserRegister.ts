export interface IUserRegister {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    nic: string;
    phone: string;
    doB: string;
    gender: string;
    imagePath: string;
    userRole: number;
    branchId: number;
    address: {
      street: string;
      city: string;
      district: string;
      province: string;
      country: string;
    };
  }
  
  export enum UserRoles {
    SuperAdmin,
    Admin,
    Trainer,
  }
  