import { Pipe, PipeTransform } from '@angular/core';
import { ProgramReport } from '../../../Models/programReport';

@Pipe({
  name: 'programTypeFilter',
  standalone: true
})
export class ProgramTypeFilterPipe implements PipeTransform {

  transform(programs: ProgramReport[], typeId: number | null): ProgramReport[] {
    if (!typeId) {
      return programs; // Return all programs if memberId is not provided or is null
    }

    return programs.filter(program => program.typeId === typeId); // Filter by exact match of memberId
  }

}
