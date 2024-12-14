export interface LeaveProgramRequest {
    requestId: number;
    memberId?: number;
    programId?: number;
    requestType: string;
    status: string;
  }

  export interface LeaveProgramRequestDTO {
    memberId?: number;
    programId?: number;
  }
  