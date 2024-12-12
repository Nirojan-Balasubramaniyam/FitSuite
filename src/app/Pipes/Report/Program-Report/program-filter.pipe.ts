import { Pipe, PipeTransform } from '@angular/core';
import { ProgramReport } from '../../../Models/programReport';
import { ProgramReportDetail } from '../../../Models/programReportDetail';

@Pipe({
  name: 'programFilter',
  standalone: true
})
export class ProgramFilterPipe implements PipeTransform {

  transform(programs: ProgramReportDetail[],  programId: number | null, typeId: number | null): ProgramReportDetail[] {
    if (!programId && !typeId) {
      return programs;
    }

    return programs.filter(program => {
      const matchesProgramId = programId ? program.programId === programId : true;
      const matchesTypeId = typeId ? program.typeId === typeId : true;
      return matchesProgramId && matchesTypeId; // Both conditions should be true
    }); 
  }
}
