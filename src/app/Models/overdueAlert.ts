export interface Alert {
    alertId: number;
    alertType: string;
    memberId: number;  
    amount?: number;    
    programId?: number; 
    dueDate?: string;    
    accessedDate?: string; 
    status?: boolean;   
    action?: boolean;   
  }

  export interface AlertReq {
    alertType: string;
    memberId: number;  
    amount?: number;    
    programId?: number; 
    dueDate?: string;    
    accessedDate?: string; 
    status?: boolean;   
    action?: boolean;   
  }