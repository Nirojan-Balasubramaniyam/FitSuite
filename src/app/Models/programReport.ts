import { ProgramReportDetail } from "./programReportDetail";

export interface ProgramReport {
    typeName: string;
    typeId: number;
    totalMembers: number;
    followersPercentage: number;
    totalEnrollingMembers: number;
    programs: ProgramReportDetail[];
  }

