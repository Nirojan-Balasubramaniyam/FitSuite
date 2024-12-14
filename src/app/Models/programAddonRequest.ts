export interface ProgramAddonRequest {
    requestId?: number;
    memberId?: number;
    programId?: number;
    amount?: number;
    receiptNumber?: string;
    paidDate?: string; // Use string for ISO Date format
    requestType: string;
    status: string;
  }

  export interface ProgramAddonRequestDTO {
    memberId?: number;
    programId?: number;
    amount?: number;
    receiptNumber?: string;
    paidDate?: string;
  }
  
  