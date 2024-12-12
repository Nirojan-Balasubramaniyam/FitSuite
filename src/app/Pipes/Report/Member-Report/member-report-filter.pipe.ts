import { Pipe, PipeTransform } from '@angular/core';
import { MemberReport } from '../../../Models/memberReport';

@Pipe({
  name: 'memberReportFilter',
  standalone: true
})
export class MemberReportFilterPipe implements PipeTransform {

  transform(members: MemberReport[], memberId: number | null): MemberReport[] {
    if (!memberId) {
      return members; // Return all members if memberId is not provided or is null
    }

    return members.filter(payment => payment.memberId === memberId); // Filter by exact match of memberId
  }

}
