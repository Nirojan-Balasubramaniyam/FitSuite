export interface Alert {
    alertId: number;
    alertType: string;
    memberId: number;  // Optional
    amount?: number;    // Optional
    programId?: number; // Optional
    dueDate?: Date;     // Optional
    accessedDate?: Date; // Optional
    status?: boolean;   // Optional
    action?: boolean;   // Optional
  }