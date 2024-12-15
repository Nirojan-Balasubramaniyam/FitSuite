import { Pipe, PipeTransform } from '@angular/core';
import { ApprovalRequest } from '../../Models/approvalRequest';

@Pipe({
  name: 'requestFilter',
  standalone: true
})
export class RequestFilterPipe implements PipeTransform {

  transform(approvalRequests: ApprovalRequest[], searchText: string): ApprovalRequest[] {
    if (!approvalRequests || !searchText) {
      return approvalRequests; 
    }

 
    if (searchText === 'Pending') {
      return approvalRequests.filter(request => request.status.toLowerCase() === 'pending');
    }

  
    if (searchText === 'Reviewed') {
      return approvalRequests.filter(request => request.status.toLowerCase() !== 'pending');
    }

    // Return all requests if the searchText is neither 'Pending' nor 'Reviewed'
    return approvalRequests;
  }
}
